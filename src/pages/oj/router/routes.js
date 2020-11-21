// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  FAQ,
  AboutUs,
  Home,
  Logout,
  NotFound,
  OIRank,
  ExperienceRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  UserHome,
  IDE,
  Forum,
  ForumList,
  ForumPost
} from '../views'

import * as Contest from '@oj/views/contest'
import * as Setting from '@oj/views/setting'

export default [
  {
    name: 'home',
    path: '/',
    meta: {title: 'Học lập trình tương tác trực tuyến'},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: 'Logout'},
    component: Logout
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: 'Apply Reset Password'},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: 'Reset Password'},
    component: ResetPassword
  },
  {
    name: 'problem-list',
    path: '/problem',
    meta: {title: 'Danh sách bài tập'},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: 'Chi tiết bài tập'},
    component: Problem
  },
  {
    name: 'submission-list',
    path: '/status',
    meta: {title: 'Danh sách bài nộp'},
    component: SubmissionList
  },
  {
    name: 'submission-details',
    path: '/status/:id/',
    meta: {title: 'Chi tiết bài nộp'},
    component: SubmissionDetails
  },
  {
    name: 'contest-list',
    path: '/contest',
    meta: {title: 'Danh sách kỳ thi'},
    component: Contest.ContestList
  },
  {
    name: 'contest-details',
    path: '/contest/:contestID/',
    component: Contest.ContestDetails,
    meta: {title: 'Chi tiết cuộc thi'},
    children: [
      {
        name: 'contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'contest-problem-list',
        path: 'problems',
        component: Contest.ContestProblemList
      },
      {
        name: 'contest-problem-details',
        path: 'problem/:problemID/',
        component: Problem
      },
      {
        name: 'contest-announcement-list',
        path: 'announcements',
        component: Announcements
      },
      {
        name: 'contest-rank',
        path: 'rank',
        component: Contest.ContestRank
      },
      {
        name: 'acm-helper',
        path: 'helper',
        component: Contest.ACMContestHelper
      }
    ]
  },
  {
    name: 'acm-rank',
    path: '/acm-rank',
    meta: {title: 'Bảng xếp hạng ACM'},
    component: ACMRank
  },
  {
    name: 'oi-rank',
    path: '/oi-rank',
    meta: {title: 'Bảng xếp hạng OI'},
    component: OIRank
  },
  {
    name: 'experience-rank',
    path: '/experience-rank',
    meta: {title: 'Bảng xếp hạng Điểm kinh nghiệm'},
    component: ExperienceRank
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {requiresAuth: true, title: 'User Home'}
  },
  {
    path: '/setting',
    component: Setting.Settings,
    children: [
      {
        name: 'default-setting',
        path: '',
        meta: {requiresAuth: true, title: 'Default Settings'},
        component: Setting.ProfileSetting
      },
      {
        name: 'profile-setting',
        path: 'profile',
        meta: {requiresAuth: true, title: 'Profile Settings'},
        component: Setting.ProfileSetting
      },
      {
        name: 'account-setting',
        path: 'account',
        meta: {requiresAuth: true, title: 'Account Settings'},
        component: Setting.AccountSetting
      },
      {
        name: 'security-setting',
        path: 'security',
        meta: {requiresAuth: true, title: 'Security Settings'},
        component: Setting.SecuritySetting
      }
    ]
  },
  {
    path: '/judger',
    name: 'judger',
    meta: {title: 'Thông tin máy chấm'},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: 'Câu hỏi thường gặp (FAQ)'},
    component: FAQ
  },
  {
    path: '/about',
    name: 'AboutUs',
    meta: {title: 'Về chúng tôi'},
    component: AboutUs
  },
  {
    path: '/ide',
    name: 'IDE',
    meta: {title: 'Live IDE'},
    component: IDE
  },
  {
    name: 'Forum-list',
    path: '/forum',
    meta: {title: 'Danh sách thảo luận'},
    component: ForumList
  },
  {
    name: 'Forum-post',
    path: '/post',
    meta: {title: 'Tạo thảo luận'},
    component: ForumPost
  },
  {
    name: 'Forum-details',
    path: '/forum/:forumpostID',
    meta: {title: 'Chi tiết thảo luận'},
    component: Forum
  },
  {
    name: 'NotFound',
    path: '*',
    meta: {title: '404 Not Found'},
    component: NotFound
  }
]
