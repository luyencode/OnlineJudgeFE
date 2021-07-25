<template>
  <Row type="flex" :gutter="20">
    <Col :span="19" id="status">
      <Alert v-if="status.type !== 'primary'" :type="status.type" show-icon>
        <span class="title">{{$t('m.' + status.statusName.replace(/ /g, "_"))}}</span>
        <div slot="desc" class="content">
          <template>
            <pre  v-if="isCE">{{submission.statistic_info.err_info}}</pre>
            <span v-if="submission.problem && submission.contest">{{$t('m.Problem')}}: <a :href="'/contest/' + submission.contest + '/problem/' + submission.problem" style="color: #495060;">{{submission.problem}}</a></span>
            <span v-else-if="submission.problem">{{$t('m.Problem')}}: <a :href='/problem/ + submission.problem' style="color: #495060;">{{submission.problem}}</a></span>
            <span>{{$t('m.Time')}}: {{submission.statistic_info.time_cost | submissionTime}}</span>
            <span>{{$t('m.Memory')}}: {{submission.statistic_info.memory_cost | submissionMemory}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: <a :href="'/user-home?username=' + submission.username" style="color: #495060;">{{submission.username}}</a></span>
          </template>
        </div>
      </Alert>
      <Alert v-else show-icon>
        <span class="title">{{$t('m.' + status.statusName.replace(/ /g, "_"))}}</span>
        <div slot="desc" class="content">
          <template>
            <pre  v-if="isCE">{{submission.statistic_info.err_info}}</pre>
            <span v-if="submission.problem && submission.contest">{{$t('m.Problem')}}: <a :href="'/contest/' + submission.contest + '/problem/' + submission.problem" style="color: #495060;">{{submission.problem}}</a></span>
            <span v-else-if="submission.problem">{{$t('m.Problem')}}: <a :href='/problem/ + submission.problem' style="color: #495060;">{{submission.problem}}</a></span>
            <span>{{$t('m.Time')}}: {{submission.statistic_info.time_cost | submissionTime}}</span>
            <span>{{$t('m.Memory')}}: {{submission.statistic_info.memory_cost | submissionMemory}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: <a :href="'/user-home?username=' + submission.username" style="color: #495060;">{{submission.username}}</a></span>
          </template>
        </div>
      </Alert>
      <Table v-if="submission.info && !isCE" :span="15" stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission.info.data">
      </Table>
      <Highlight :code="submission.code" :language="submission.language" :border-color="status.color"></Highlight>
      <div v-if="submission.can_unshare" :span="15" id="share-btn">
        <Button v-if="submission.shared"
                type="warning" size="large" @click="shareSubmission(false)">
          {{$t('m.UnShare')}}
        </Button>
        <Button v-else
                type="primary" size="large" @click="shareSubmission(true)">
          {{$t('m.Share')}}
        </Button>
      </div>
    </Col>
    <Col :span="5" :gutter="20">
      <Panel shadow style="padding-top: 0px;padding-bottom: 10px;min-height: 400px;">
        <div slot="title" style="margin-left: -10px;margin-bottom: -10px;">{{$t('m.Ranklist_Title')}}</div>
        <ol style="margin-left: 40px;margin-bottom: 20px;">
          <li v-for="u in dataRank" :key="u.id">
            <a :style="'font-weight: 600;color: ' + u.color" :href="'/user-home?username=' + u.user.username"
               :title=" u.title + ' ' + u.user.username">
            {{u.user.username}}
            </a> - {{u.accepted_number}} bài
          </li>
        </ol>
      </Panel>
      <div class="free-course" style="margin-top: 20px;">
        <div class="title">Khóa học miễn phí</div>
          <ul>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/cau-truc-du-lieu/" title="Cấu trúc dữ liệu">Cấu trúc dữ liệu</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/hoc-c-khong-kho/" class="series-508" title="Học C Không Khó">Học C Không Khó</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/go/learn-cpp/">Khóa học lập trình C++</a></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/bai-tap-c-co-loi-giai/">Kho bài tập C/C++</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/huong-doi-tuong-cpp/" class="series-510" title="Hướng đối tượng C++">Hướng đối tượng C++</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/python-khong-kho/" class="series-507" title="Python Không Khó">Python Không Khó</a></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/hoc-nhanh-python-trong-30-phut/" class="series-132" title="Python Quick Tutorial">Python Quick Tutorial</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/selenium-khong-kho/" class="series-358" title="Selenium không khó">Selenium không khó</a></li><li><a href="https://nguyenvanhieu.vn/series/thu-vien-flask/" class="series-131" title="Thư viện Flask">Thư viện Flask</a></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/thuc-hanh-sql/" class="series-307" title="Thực hành SQL">Thực hành SQL</a></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/hoc-lap-trinh-java/" class="series-126" title="Tự học lập trình Java">Tự học lập trình Java</a><img style="width: 20px; height: 20px;" src="https://nguyenvanhieu.vn/wp-content/uploads/2020/07/hot-icon.gif"></li>
            <li><a target="_blank" href="https://nguyenvanhieu.vn/series/tu-hoc-lap-trinh-javascript/" class="series-127" title="Tự học lập trình Javascript">Tự học Javascript</a></li>
            </ul>
          </div>
    </Col>
  </Row>

</template>

<script>
  import api from '@oj/api'
  import {RULE_TYPE, JUDGE_STATUS, USER_GRADE} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'

  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        dataRank: [],
        rankLimit: 15,
        columns: [
          {
            title: this.$i18n.t('m.ID'),
            align: 'center',
            type: 'index'
          },
          {
            title: this.$i18n.t('m.Status'),
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: JUDGE_STATUS[params.row.result].type
                }
              }, this.$i18n.t('m.' + JUDGE_STATUS[params.row.result].name.replace(/ /g, '_')))
            }
          },
          {
            title: this.$i18n.t('m.Memory'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionMemoryFormat(params.row.memory))
            }
          },
          {
            title: this.$i18n.t('m.Time'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionTimeFormat(params.row.cpu_time))
            }
          }
        ],
        submission: {
          result: '0',
          code: '',
          info: {
            data: []
          },
          statistic_info: {
            time_cost: '',
            memory_cost: ''
          }
        },
        isConcat: false,
        loading: false
      }
    },
    mounted () {
      this.getSubmission()
      this.getRankData()
    },
    methods: {
      getSubmission () {
        this.loading = true
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          if (data.info && data.info.data && !this.isConcat) {
            // score exist means the submission is OI problem submission
            if (data.info.data[0].score !== undefined) {
              this.isConcat = true
              const scoreColumn = {
                title: this.$i18n.t('m.Score'),
                align: 'center',
                key: 'score'
              }
              this.columns.push(scoreColumn)
              this.loadingTable = false
            }
            if (this.isAdminRole) {
              this.isConcat = true
              const adminColumn = [
                {
                  title: this.$i18n.t('m.Real_Time'),
                  align: 'center',
                  render: (h, params) => {
                    return h('span', utils.submissionTimeFormat(params.row.real_time))
                  }
                },
                {
                  title: this.$i18n.t('m.Signal'),
                  align: 'center',
                  key: 'signal'
                }
              ]
              this.columns = this.columns.concat(adminColumn)
            }
          }
          this.submission = data
          this.submission['problem'] = this.$route.query.problem
          this.submission['contest'] = this.$route.query.contest
        }, () => {
          this.loading = false
        })
      },
      getRankData () {
        api.getUserRank(0, this.rankLimit, RULE_TYPE.ACM).then(res => {
          this.dataRank = res.data.data.results
          for (let i in this.dataRank) {
            this.dataRank[i]['color'] = USER_GRADE[this.dataRank[i].grade].color
            this.dataRank[i]['title'] = USER_GRADE[this.dataRank[i].grade].name
          }
        }).catch(() => {
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.id, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          if (shared) {
            this.$success('Người khác có thể xem lời giải của bạn!')
          } else {
            this.$success('Người khác không thể xem lời giải của bạn!')
          }
        }, () => {
        })
      }
    },
    computed: {
      status () {
        console.log(JUDGE_STATUS[this.submission.result])
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === -2
      },
      isAdminRole () {
        return this.$store.getters.isAdminRole
      }
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 0px;
  }

  pre {
    border: none;
    background: none;
  }
  .sticky {
    margin-top: 20px;
  }
  div.free-course > .title {
    background: green;
    text-transform: uppercase;
    color: white;
    margin: 0px;
    padding: 8px;
    font-weight: bold;
    font-size: 1.2em;
  }
  div.free-course > ul{
    border: solid 4px green;
    padding: 10px;
    margin-top: 0px;
  }
  div.free-course > ul li::before {
    content: "📚";
    margin: 0px 10px 0 0px;
  }
  div.free-course > ul > li {
    font-size: 1.2em;
    padding-top: 10px;
    list-style: none;
  }
  div.free-course > ul > li > a {
    text-decoration:none;
    color: inherit;
    // font-family: monospace, sans-serif;
  }
</style>
