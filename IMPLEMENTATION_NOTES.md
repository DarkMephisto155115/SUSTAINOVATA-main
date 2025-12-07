# Implementation Notes - New Features

## Architecture Overview

### Three-Tier Architecture
- **Frontend**: Vue 3 + Vite (SPA)
- **Backend**: Node.js + Express (REST API)
- **Database**: MySQL

### Authentication Flow
```
Login → JWT Token Generated → Token stored in localStorage/sessionStorage
  ↓
API Request → Token in Authorization header
  ↓
verifyToken middleware → Decode JWT
  ↓
authorize middleware → Check role
  ↓
Route handler executes
```

---

## Backend Implementation Details

### 1. Middleware Stack

**Location:** `backend-js/src/middlewares/authorization.js`

```javascript
verifyToken(req, res, next)
- Extracts token from Authorization header
- Verifies JWT signature
- Sets req.user with decoded data
- Throws 401 if invalid

authorize(...allowedRoles)
- Checks if req.user.role is in allowedRoles array
- Throws 403 if unauthorized
- Allows multiple roles: authorize('admin', 'editor')
```

### 2. Controller Architecture

#### Pattern
- Static methods in class
- Async/await for database operations
- Try-catch error handling
- Consistent response format

#### Example
```javascript
class JournalReviewController {
  static async getPendingJournals(req, res) {
    try {
      // Query database
      // Format response
      res.status(200).json({ data: journals });
    } catch (error) {
      res.status(500).json({ message: 'Error', error: error.message });
    }
  }
}
```

### 3. Database Queries

**Using:** `mysql2/promise` with async/await

```javascript
const [results] = await db.query(sql, params);
// results = array of rows
```

**Key Points:**
- Always use parameterized queries (?)
- Handle both single row and multiple rows responses
- Check for empty results before accessing

### 4. File Upload Handling

**Location:** `backend-js/src/utils/uploads.js`

```javascript
const uploadJournal = createUploader((req, file) => {
  if (file.fieldname === 'file') return 'src/fileSaved/pdf';
  if (file.fieldname === 'cover_image') return 'src/fileSaved/images/jurnal';
  return 'src/fileSaved/other';
});

// Usage in route
router.post('/journals', uploadJournal.fields([
  { name: 'file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), AuthorJournalController.createJournal);
```

### 5. Database Transactions (Future Enhancement)

Current implementation uses individual queries. For complex operations, consider:

```javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  // Multiple operations
  await connection.commit();
} catch (error) {
  await connection.rollback();
}
```

---

## Frontend Implementation Details

### 1. Component Structure

**Location:** `frontend/src/page/`

Each page is a Vue 3 SFC (Single File Component) with `<script setup>`:

```vue
<template>
  <!-- HTML -->
</template>

<script setup>
// Imports
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getToken, getUser } from '@/utils/auth';

// State
const journals = ref([]);

// Methods
const loadJournals = async () => { ... };

// Lifecycle
onMounted(() => {
  loadJournals();
});
</script>

<style scoped>
/* Scoped styles */
</style>
```

### 2. API Communication

**Pattern:**
```javascript
const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

// GET
const res = await axios.get('http://localhost:3000/api/path', { headers });

// POST
const res = await axios.post('http://localhost:3000/api/path', data, { headers });

// File upload
const formData = new FormData();
formData.append('file', file);
await axios.post(url, formData, { 
  headers: { ...headers, 'Content-Type': 'multipart/form-data' }
});
```

### 3. State Management

**Approach:** Composition API + ref

```javascript
const data = ref(null);
const isLoading = ref(false);

const loadData = async () => {
  isLoading.value = true;
  try {
    // API call
    data.value = result;
  } finally {
    isLoading.value = false;
  }
};
```

### 4. Routing

**Location:** `frontend/src/router/index.js`

```javascript
const routes = [
  {
    path: '/editor/dashboard',
    name: 'editorDashboard',
    component: EditorDashboard
  },
  // ...
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
```

**Navigation:**
```javascript
router.push('/path');
router.push({ name: 'routeName', params: { id: 123 } });

// In template
<router-link to="/path">Link</router-link>
```

### 5. Responsive Design

**CSS Grid System:**
```css
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.col-md-3 { grid-column: span 1; }
.col-md-6 { grid-column: span 2; }

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
}
```

---

## Database Schema Design

### Relationships

```
users (1) ──────→ (many) journal_reviews
  ↓
users (1) ──────→ (many) journal_versions
  ↓
users (1) ──────→ (many) journals
  ↓
users (1) ──────→ (many) collaborations
  ↓
collaborations (1) ──────→ (many) collaboration_members
  ↓
collaboration_members (many) ──────→ (1) users
```

### Indexes (for Performance)

```sql
CREATE INDEX idx_journal_status ON jurnal(status);
CREATE INDEX idx_journal_editor ON journal_reviews(FK_ID_editor);
CREATE INDEX idx_collab_owner ON collaborations(owner_id);
CREATE INDEX idx_collab_member ON collaboration_members(FK_ID_user);
```

### Foreign Key Constraints

```sql
FOREIGN KEY (ID_jurnal) REFERENCES jurnal(ID_jurnal) ON DELETE CASCADE
```

---

## Error Handling Strategy

### Backend Error Responses

**Standard format:**
```javascript
res.status(httpCode).json({
  message: 'User-friendly message',
  error: 'Detailed error for debugging'
});
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

### Frontend Error Handling

```javascript
try {
  const res = await axios.get(url, { headers });
  data.value = res.data.data;
} catch (error) {
  const message = error.response?.data?.message || error.message;
  alert('Error: ' + message);
  console.error(error);
}
```

---

## Security Considerations

### 1. JWT Tokens
- Stored in localStorage/sessionStorage (not httpOnly cookies)
- Include in Authorization header for API calls
- Verify on every request

### 2. Database Queries
- Always use parameterized queries (prevent SQL injection)
- Never concatenate user input directly into SQL

### 3. File Upload
- Validate file types and sizes
- Store outside web root if possible
- Generate unique filenames with timestamps

### 4. CORS Configuration
- Only allow trusted origins
- Development: http://localhost:5173
- Production: Update to actual domain

### 5. Input Validation
- Validate data types
- Check required fields
- Sanitize user input

---

## Performance Optimization

### Database
- Use indexes for frequently queried columns
- Avoid N+1 queries (use JOIN)
- Implement pagination for large datasets
- Connection pooling (already in mysql2)

### Frontend
- Lazy load routes with Vue.lazy
- Code splitting with dynamic imports
- Vite's optimized builds
- Minimize re-renders with computed properties

### API
- Implement response caching
- Use pagination and filtering
- Compress responses with gzip
- Rate limiting for heavy operations

---

## Testing Checklist

### Unit Tests (Future)
- Controller methods
- Middleware functions
- Utility functions

### Integration Tests (Future)
- API endpoints with database
- User workflows
- Permission checks

### Manual Testing

#### Editor Review Flow
- [ ] Login sebagai editor
- [ ] View pending journals
- [ ] Open journal detail
- [ ] Submit review dengan approve/revision/reject
- [ ] Verify journal status updated

#### Author Journal Flow
- [ ] Login sebagai author
- [ ] Create journal
- [ ] Save as draft
- [ ] Edit journal
- [ ] Submit untuk review
- [ ] View review status
- [ ] Upload revision jika diminta

#### Collaboration Flow
- [ ] Create collaboration
- [ ] Upload file
- [ ] Add members
- [ ] Remove members
- [ ] Update collaboration

#### Permission Tests
- [ ] Admin cannot access /editor/dashboard
- [ ] Editor cannot access /admin/dashboard
- [ ] Author cannot view other author's journals

---

## Deployment Checklist

### Backend
- [ ] Update .env untuk production
- [ ] Set NODE_ENV=production
- [ ] Database backups configured
- [ ] JWT_SECRET strong dan unique
- [ ] CORS origins updated
- [ ] File upload directories writable

### Frontend
- [ ] Run npm run build
- [ ] Update API_BASE_URL for production
- [ ] Test all routes
- [ ] Check responsive design
- [ ] Verify authentication flow

### Database
- [ ] Migration scripts applied
- [ ] Backup created
- [ ] Indexes verified
- [ ] Foreign keys constraints active

---

## Code Style Guidelines

### JavaScript
- Use async/await instead of .then()
- Use const/let instead of var
- Use template literals for strings
- Arrow functions for callbacks

### Vue Components
- Use <script setup> syntax
- Scoped styles only
- Separate concerns (template, logic, styles)
- Meaningful variable names

### CSS
- Use CSS variables for colors/spacing
- Mobile-first responsive design
- Scoped styles in components
- Consistent naming (BEM-like)

### Comments
- Only when necessary
- Explain "why", not "what"
- Keep updated with code changes

---

## Troubleshooting

### JWT Token Issues
**Problem:** "Invalid token"
**Solution:** 
- Check JWT_SECRET matches in .env
- Verify token expiration
- Ensure proper Authorization header format: "Bearer <token>"

### Database Connection
**Problem:** "Cannot connect to database"
**Solution:**
- Check MySQL is running
- Verify connection credentials in .env
- Check database exists: sustainovata-db

### File Upload Failed
**Problem:** "File not found" after upload
**Solution:**
- Check folder exists: backend-js/src/fileSaved/
- Verify permissions: chmod 755
- Check disk space available

### CORS Error
**Problem:** "Access to XMLHttpRequest blocked by CORS"
**Solution:**
- Frontend URL matches corsOptions
- Headers include Authorization
- Check middleware order in app.js

---

## Git Workflow

### Branch Naming
- `feature/journal-management`
- `fix/auth-bug`
- `refactor/styling`

### Commit Messages
- `feat: add editor journal review`
- `fix: fix file upload error`
- `refactor: improve code style`
- `docs: update README`

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request with description
5. Code review
6. Merge to main

---

## Resources

### Documentation
- Vue 3: https://vuejs.org/
- Express.js: https://expressjs.com/
- MySQL: https://www.mysql.com/
- JWT: https://jwt.io/

### Tools
- Postman: API testing
- VS Code: Editor
- Git: Version control
- MySQL Workbench: Database management

