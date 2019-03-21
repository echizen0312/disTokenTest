/* import Vue from 'vue'
import Router from 'vue-router' */
const Home = () => import('@/components/Home').then(m => m.default)
const AccountList = () => import('@/components/AccountList').then(m => m.default)
const EOSTest = () => import('@/sakuya/EOSTest').then(m => m.default)
const guide = () => import('@/components/guide').then(m => m.default)
const CreateAccount = () => import('@/components/CreateAccount').then(m => m.default)
const ImportAccount = () => import('@/components/ImportAccount').then(m => m.default)
const CopyPrKey = () => import('@/components/CopyPrKey').then(m => m.default)
const HomeList = () => import('@/components/HomeList').then(m => m.default)
const WalletHome = () => import('@/components/WalletHome').then(m => m.default)
const Coindetails = () => import('@/components/Coindetails').then(m => m.default)
const AllTransferList = () => import('@/components/AllTransferList').then(m => m.default)
const Transfer = () => import('@/components/Transfer').then(m => m.default)
const paymentCode = () => import('@/components/paymentCode').then(m => m.default)
const selectAccount = () => import('@/components/selectAccount').then(m => m.default)
const PayeeQrcode = () => import('@/components/PayeeQrcode').then(m => m.default)
const Crosslinktransfer = () => import('@/components/Crosslinktransfer').then(m => m.default)
const GameList = () => import('@/components/GameList').then(m => m.default)
const RequestTransaction = () => import('@/components/RequestTransaction').then(m => m.default)
const RequestTransfer = () => import('@/components/RequestTransfer').then(m => m.default)
const hb = () => import('@/components/hongbao').then(m => m.default)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {'path': '/CreateAccount', component: CreateAccount, 'name': 'CreateAccount'},
      {'path': '/ImportAccount', component: ImportAccount, 'name': 'ImportAccount'},
      {'path': '/CopyPrKey', component: CopyPrKey, 'name': 'CopyPrKey'},
      {'path': '/HomeList', component: HomeList, 'name': 'HomeList'},
      {'path': '/WalletHome/:id', component: WalletHome, 'name': 'WalletHome'},
      {'path': '/Coindetails/:id/:code/:symbol/:balance', component: Coindetails, 'name': 'Coindetails'},
      {'path': '/AllTransferList/:id', component: AllTransferList, 'name': 'AllTransferList'},
      {'path': '/Transfer/:id/:code/:symbol/:balance', component: Transfer, 'name': 'Transfer'},
      ////////////////////////////////////
      {'path': '/AccountList', component: AccountList, 'name': 'AccountList'},
      {'path': '/Crosslinktransfer/:id/:code/:symbol/:balance', component: Crosslinktransfer, 'name': 'Crosslinktransfer'},
      {'path': '/GameList', component: GameList, 'name': 'GameList'},
      {path: '/RequestTransaction/:netId/:accName/:tr',component: RequestTransaction, name: 'RequestTransaction'},
      {path: '/RequestTransfer/:netId/:code/:symbol/:to/:number/:memo',component: RequestTransfer, name: 'RequestTransfer'},
      {'path': '/EOSTest', component: EOSTest, 'name': 'EOSTest'}
    ]
  },
  { path: '/guide', name: 'guide', component: guide },
  {'path': '/paymentCode/:id', component: paymentCode, 'name': 'paymentCode'},
  {'path': '/selectAccount/:id', component: selectAccount, 'name': 'selectAccount'},
  {'path': '/PayeeQrcode/:id/:code/:symbol', component: PayeeQrcode, 'name': 'PayeeQrcode'},
  { path: '/hb', name: 'hb', component: hb }
]

export default routes
