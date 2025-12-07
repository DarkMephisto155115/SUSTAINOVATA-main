import { createRouter, createWebHistory } from "vue-router";

import Home from "@pages/home.vue";
import About from "@pages/about.vue";
import Programs from "@pages/programs.vue";
import Publications from "@pages/publication.vue";
import Kemitraan from "@pages/kemitraan.vue";
import News from "@pages/news.vue";
import Contact from "@pages/contact.vue";
import Research from "@pages/research.vue";
import ProgramDetail from "@pages/programDetail.vue";
import NewsDetail from "@pages/newsDetail.vue";
import PublicationDetail from "@pages/publicationDetail.vue";
import ResourceDetail from "@pages/resourceDetail.vue";
import ResearchDetail from "@pages/researchDetail.vue";

import Login from "@pages/auth/login.vue";
import Register from "@pages/auth/register.vue";
import ForgotPass from "@pages/auth/forgotPass.vue";

import NotFound from "@pages/notFound/notFound.vue";

import Dashboard from "@adminPage/dashboard.vue";
import Program from "@kelola/program.vue";
import Berita from "@kelola/berita.vue";
import Messages from "@kelola/messages.vue";
import TambahProgram from "@tambah/program.vue";
import TambahBerita from "@tambah/berita.vue";

// Editor pages
import EditorDashboard from "@pages/editor/dashboard.vue";
import JournalReview from "@pages/editor/journalReview.vue";
import JournalsList from "@pages/editor/journalsList.vue";
import EditorCollaborations from "@pages/editor/collaborations.vue";
import EditorMessages from "@pages/editor/messages.vue";
import CollaborationRequests from "@pages/editor/collaborationRequests.vue";

// Author pages
import MyJournals from "@pages/author/myJournals.vue";
import JournalForm from "@pages/author/journalForm.vue";
import PendingJournals from "@pages/author/pendingJournals.vue";

// Profile page
import Profile from "@pages/profile.vue";

// Collaboration request page
import Collaboration from "@pages/collaboration.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/programs",
    name: "programs",
    component: Programs,
  },
  {
    path: "/programs/:id",
    name: "programDetail",
    component: ProgramDetail,
  },
  {
    path: "/publications",
    name: "publications",
    component: Publications,
  },
  {
    path: "/publications/:id",
    name: "publicationDetail",
    component: PublicationDetail,
  },
  {
    path: "/kemitraan",
    name: "kemitraan",
    component: Kemitraan,
  },
  {
    path: "/news",
    name: "news",
    component: News,
  },
  {
    path: "/news/:id",
    name: "newsDetail",
    component: NewsDetail,
  },
  {
    path: "/resources/:id",
    name: "resourceDetail",
    component: ResourceDetail,
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
  },
  {
    path: "/research",
    name: "research",
    component: Research,
  },
  {
    path: "/research/:id",
    name: "researchDetail",
    component: ResearchDetail,
  },
  // auth routes
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/forgotPass",
    name: "forgotPass",
    component: ForgotPass,
  },

  // Admin Routes
  {
    path: "/admin/dashboard",
    name: "dashboardAdmin",
    component: Dashboard,
  },
  {
    path: "/admin/kelola/program",
    name: "programAdmin",
    component: Program,
  },
  {
    path: "/admin/kelola/berita",
    name: "beritaAdmin",
    component: Berita,
  },
  {
    path: "/admin/kelola/messages",
    name: "messagesAdmin",
    component: Messages,
  },
  {
    path: "/admin/tambah/program",
    name: "tambahProgramAdmin",
    component: TambahProgram,
  },
  {
    path: "/admin/tambah/berita",
    name: "tambahBeritaAdmin",
    component: TambahBerita,
  },

  // Editor Routes
  {
    path: "/editor/dashboard",
    name: "editorDashboard",
    component: EditorDashboard,
  },
  {
    path: "/editor/journals",
    name: "journalsList",
    component: JournalsList,
  },
  {
    path: "/editor/journal/:id",
    name: "journalReview",
    component: JournalReview,
  },
  {
    path: "/editor/collaborations",
    name: "editorCollaborations",
    component: EditorCollaborations,
  },
  {
    path: "/editor/messages",
    name: "editorMessages",
    component: EditorMessages,
  },
  {
    path: "/editor/collaboration-requests",
    name: "collaborationRequests",
    component: CollaborationRequests,
  },

  // Author Routes
  {
    path: "/author/journals",
    name: "myJournals",
    component: MyJournals,
  },
  {
    path: "/author/journals/pending",
    name: "pendingJournals",
    component: PendingJournals,
  },
  {
    path: "/author/journals/create",
    name: "createJournal",
    component: JournalForm,
  },
  {
    path: "/author/journals/:id",
    name: "editJournal",
    component: JournalForm,
  },

  // Profile Routes
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },

  // Collaboration Routes
  {
    path: "/collaborations",
    name: "collaborationRequest",
    component: Collaboration,
  },

  // not found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
