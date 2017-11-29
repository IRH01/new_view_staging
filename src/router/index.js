import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = resolve => require(['../components/index/index.vue'], resolve)
const GameCenter = resolve => require(['../components/gameCenter/gameCenter.vue'], resolve)
const Find = resolve => require(['../components/find/find.vue'], resolve)
const Mine = resolve => require(['../components/mine/mine.vue'], resolve)
const Login = resolve => require(['../components/login/login.vue'], resolve)
const games = resolve => require(['../components/games/games.vue'], resolve)
const gamelist = resolve => require(['../components/gamelist/gamelist.vue'], resolve)
const Set = resolve => require(['../components/set/set.vue'], resolve)
const AlterPass = resolve => require(['../components/alterPass/alterPass.vue'], resolve)
const Suggest = resolve => require(['../components/suggest/suggest.vue'], resolve)
const About = resolve => require(['../components/about/about.vue'], resolve)
const Record = resolve => require(['../components/Record/Record.vue'], resolve)
const Rule = resolve => require(['../components/rule/rule.vue'], resolve)
const Register = resolve => require(['../components/register/register.vue'], resolve)
const FindPassword = resolve => require(['../components/findPassword/findPassword.vue'], resolve)
const Boundphone = resolve => require(['../components/boundphone/boundphone.vue'], resolve)
const Tradebind = resolve => require(['../components/tradebind/tradebind.vue'], resolve)
const information = resolve => require(['../components/information/information.vue'], resolve)
const informationXx = resolve => require(['../components/information/informationXx.vue'], resolve)
const qiandao = resolve => require(['../components/qiandao/qiandao.vue'], resolve)
const PersonalInfo = resolve => require(['../components/personalInfo/personalInfo.vue'], resolve)
const ChangeName = resolve => require(['../components/changeName/changeName.vue'], resolve)
const ChangeQQ = resolve => require(['../components/changeQQ/changeQQ.vue'], resolve)
const ChangeAddress = resolve => require(['../components/changeAddress/changeAddress.vue'], resolve)
const integral = resolve => require(['../components/integral/integral.vue'], resolve)
const IntegralDetails = resolve => require(['../components/integralDetails/integralDetails.vue'], resolve)
const Pay = resolve => require(['../components/pay/pay.vue'], resolve)
const payType = resolve => require(['../components/payType/payType.vue'], resolve)
const Mygold = resolve => require(['../components/mygold/mygold.vue'], resolve)
const RemitAccount = resolve => require(['../components/remitAccount/remitAccount.vue'], resolve)
const SelectAccount = resolve => require(['../components/selectAccount/selectAccount.vue'], resolve)
const gameLog = resolve => require(['../components/gameLog/gameLog.vue'], resolve)
const Setpassword = resolve => require(['../components/setpassword/setpassword.vue'], resolve)
const PayDetails = resolve => require(['../components/payDetails/payDetails.vue'], resolve)
const RemitAccountDetails = resolve => require(['../components/remitAccountDetails/remitAccountDetails.vue'], resolve)
const PayBankFill1 = resolve => require(['../components/payBankFill1/payBankFill1.vue'], resolve)
const PayBankFill2 = resolve => require(['../components/payBankFill2/payBankFill2.vue'], resolve)
const PayBankSMSfill = resolve => require(['../components/payBankSMSfill/payBankSMSfill.vue'], resolve)
const Payresult = resolve => require(['../components/payresult/payresult.vue'], resolve)
const BankCard = resolve => require(['../components/bankCard/bankCard.vue'], resolve)
const Activity = resolve => require(['../components/activity/activity.vue'], resolve)
const Serviceagreement = resolve => require(['../components/serviceagreement/serviceagreement.vue'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index
    },
    {
      path: '/gameCenter',
      component: GameCenter
    },
    {
      path: '/find',
      component: Find
    },
    {
      path: '/mine',
      component: Mine
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/qiandao',
      component: qiandao
    },
    {
      path: '/gamelist/:id',
      component: gamelist
    },
    {
      path: '/games/:id',
      component: games
    },
    {
      path: '/set',
      component: Set
    },
    {
      path: '/alterPass',
      component: AlterPass
    },
    {
      path: '/suggest',
      component: Suggest
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/record/:id',
      component: Record
    },
    {
      path: '/rule/:id',
      component: Rule
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/findPassword',
      component: FindPassword
    },
    {
      path: '/boundphone',
      component: Boundphone
    },
    {
      path: '/information',
      component: information
    },
    {
      path: '/tradebind',
      component: Tradebind
    },
    {
      path: '/informationXx/:id',
      component: informationXx
    },
    {
      path: '/personalInfo',
      component: PersonalInfo
    },
    {
      path: '/changeName',
      component: ChangeName
    },
    {
      path: '/changeQQ',
      component: ChangeQQ
    },
    {
      path: '/changeAddress',
      component: ChangeAddress
    },
    {
      path: '/integral',
      component: integral
    },
    {
      path: '/integralDetails',
      component: IntegralDetails
    },
    {
      path: '/pay',
      component: Pay
    },
    {
      path: '/payType',
      component: payType
    },
    {
      path: '/mygold',
      component: Mygold
    },
    {
      path: '/remitAccount',
      component: RemitAccount
    },
    {
      path: '/selectAccount',
      component: SelectAccount
    },
    {
      path: '/gameLog',
      component: gameLog
    },
    {
      path: '/setpassword',
      component: Setpassword
    },
    {
      path: '/payDetails',
      component: PayDetails
    },
    {
      path: '/remitAccountDetails',
      component: RemitAccountDetails
    },
    {
      path: '/payBankFill1',
      component: PayBankFill1
    },
    {
      path: '/payBankFill2',
      component: PayBankFill2
    },
    {
      path: '/payBankSMSfill',
      component: PayBankSMSfill
    },
    {
      path: '/payresult',
      component: Payresult
    },
    {
      path: '/bankCard',
      component: BankCard
    },
    {
      path: '/activity',
      component: Activity
    },
    {
      path: '/serviceagreement',
      component: Serviceagreement
    },
    {
      path: '*',
      redirect: './index'
    }
  ]
})
