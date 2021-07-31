<template>
  <div class="container">
    <div class="avatar-container">
      <img class="avatar" :src="profile.avatar"/>
    </div>
    <Card :padding="100">
      <div v-if="profile.user"  :title="profile.real_name">
        <p style="margin-top: -10px">
          <span v-if="profile.user" class="emphasis">
            <Tag v-if="profile.user.title" :color="profile.user.title_color">{{ profile.user.title }}</Tag>
            <Tag v-else :color="color">{{ gradename }}</Tag>
            <span v-if="profile.real_name">{{profile.real_name}}</span>
            <span v-else>{{profile.user.username}}</span>
          </span>
        </p>
        <p v-if="profile.school" style="font-size: 1.2em;color: rgb(48 141 240);"><span style="    border: 1px dotted rgb(229 233 236);padding: 5px;"><span v-if="profile.major">{{profile.major}} - </span> {{profile.school}}</span></p>
        <p v-if="profile.mood">
          {{profile.mood}}
        </p>
        <div id="social-network">
          <a :href="profile.github">
            <Icon type="social-github-outline" size="30"></Icon>
          </a>
          <a :href="'mailto:'+ profile.user.email">
            <Icon class="icon" type="ios-email-outline" size="30"></Icon>
          </a>
          <a :href="profile.blog">
            <Icon class="icon" type="ios-world-outline" size="30"></Icon>
          </a>
        </div>
        <hr id="split"/>
        <div class="flex-container">
          <div class="left">
            <p>{{$t('m.UserHomeSolved')}}</p>
            <p class="emphasis">{{this.count_ac}}</p>
          </div>
          <div class="middle">
            <p>{{$t('m.UserHomeserSubmissions')}}</p>
            <p class="emphasis">{{profile.submission_number}}</p>
          </div>
          <div class="right">
            <p>{{$t('m.UserHomeScore')}}</p>
            <p class="emphasis">{{profile.total_score}}</p>
          </div>
        </div>
        <div id="problems">
          <div v-if="this.count_ac">{{$t('m.List_Solved_Problems')}} ({{this.count_ac}})
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-outline"></Icon>
              <div slot="content">
                <p>Nếu bạn thấy 1 bài tập nào đó không tồn tại, <br> click vào button để tải lại.</p>
                <Button type="info" @click="freshProblemDisplayID">regenerate</Button>
              </div>
            </Poptip>
          </div>
          
          <p v-else>{{$t('m.UserHomeIntro')}}</p>
          <div class="btns">
            <div class="problem-btn" v-for="problemID of ac_problems" :key="problemID">
              <Button  @click="goProblem(problemID)">{{problemID}}</Button>
            </div>
          </div>
          <div v-if="this.count_tried" style="margin-top: 30px;">{{$t('m.List_Tried_Problems')}} ({{this.count_tried}})
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-outline"></Icon>
              <div slot="content">
                <p>Nếu bạn thấy 1 bài tập nào đó không tồn tại, <br> nhấp vào button để làm mới.</p>
                <Button type="info" @click="freshProblemDisplayID">Làm mới</Button>
              </div>
            </Poptip>
          </div>
          <div class="btns">
            <div class="problem-btn" v-for="problemID of tried_problems" :key="problemID">
            <Button @click="goProblem(problemID)">{{problemID}}</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import time from '@/utils/time'
  import api from '@oj/api'
  import { USER_GRADE } from '@/utils/constants'

  export default {
    data () {
      return {
        username: '',
        profile: {},
        ac_problems: [],
        count_ac: 0,
        tried_problems: [],
        count_tried: 0,
        color: '',
        gradename: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.username = this.$route.query.username
        api.getUserInfo(this.username).then(res => {
          this.changeDomTitle({title: res.data.data.user.username})
          this.profile = res.data.data
          this.color = USER_GRADE[res.data.data.grade].color
          this.gradename = USER_GRADE[res.data.data.grade].name
          this.getUserProblems()
          let registerTime = time.utcToLocal(this.profile.user.create_time, 'YYYY-MM-D')
          console.log('The guy registered at ' + registerTime + '.')
        })
      },
      getUserProblems () {
        let ACMProblems = this.profile.acm_problems_status.problems || {}
        let OIProblems = this.profile.oi_problems_status.problems || {}
        // todo oi problems
        let ACProblems = []
        let TriedProblems = []
        let found = {}
        let CountAC = 0
        let CountTried = 0
        for (let problems of [ACMProblems, OIProblems]) {
          Object.keys(problems).forEach(problemID => {
            if (problems[problemID]['status'] === 0 && !found.hasOwnProperty(problems[problemID]['_id'])) {
              if (!problems[problemID]['_id'].startsWith('FH_')) {
                ACProblems.push(problems[problemID]['_id'])
                found[problems[problemID]['_id']] = 1
              }
              CountAC += 1
            } else if (problems[problemID]['status'] !== 0 && !found.hasOwnProperty(problems[problemID]['_id'])) {
              if (!problems[problemID]['_id'].startsWith('FH_')) {
                TriedProblems.push(problems[problemID]['_id'])
                found[problems[problemID]['_id']] = 1
              }
              CountTried += 1
            }
          })
        }
        this.ac_problems = ACProblems.sort()
        this.tried_problems = TriedProblems.sort()
        this.count_ac = CountAC
        this.count_tried = CountTried
      },
      goProblem (problemID) {
        this.$router.push({name: 'problem-details', params: {problemID: problemID}})
      },
      freshProblemDisplayID () {
        api.freshDisplayID().then(res => {
          this.$success('Update successfully')
          this.init()
        })
      }
    },
    computed: {
      refreshVisible () {
        if (!this.username) return true
        if (this.username && this.username === this.$store.getters.user.username) return true
        return false
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    width: 75%;
    margin: 170px auto;
    text-align: center;
    p {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .avatar-container {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      z-index: 1;
      top: -90px;
      .avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
      }
    }
    .emphasis {
      font-size: 20px;
      font-weight: 600;
    }
    #split {
      margin: 20px auto;
      width: 90%;
    }
    .flex-container {
      margin-top: 30px;
      padding: auto 20px;
      .left {
        flex: 1 1;
      }
      .middle {
        flex: 1 1;
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }
      .right {
        flex: 1 1;
      }
    }
    #problems {
      margin-top: 40px;
      padding-left: 30px;
      padding-right: 30px;
      font-size: 18px;
      .btns {
        margin-top: 15px;
        .problem-btn {
          display: inline-block;
          margin: 5px;
        }
      }
    }
    #social-network {
      text-align: center;
      .icon {
        padding-left: 20px;
      }
    }
  }
</style>
