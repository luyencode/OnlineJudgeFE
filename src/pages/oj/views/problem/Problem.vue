<style>
  .utterances {
      max-width: 100%;
      width: 100%;
  }
</style>
<template>
  <div class="flex-container">
    <div id="problem-main">
      <!--problem main-->
      <Panel :padding="40" shadow>
        <div class="report"><a title="Báo lỗi bài tập này" target="_blank" onclick="event.preventDefault();window.open('https://github.com/luyencode/comments/issues/365', '_blank');" rel="noreferrer nofollow noopener"><i class="ivu-icon ivu-icon-md-bug"></i> {{$t('m.Report')}}</a></div>
        <h2 slot="title" class="problem-title">{{problem._id}} - {{problem.title}}</h2>
        <div id="problem-content" class="markdown-body" v-katex>
          <h3 class="title">{{$t('m.Description')}}</h3>
          <p class="content" v-html=problem.description></p>
          <!-- {{$t('m.music')}} -->
          <h3 class="title">{{$t('m.Input')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.FromFile')}}: {{ problem.io_mode.input }})</span></h3>
          <p class="content" v-html=problem.input_description></p>

          <h3 class="title">{{$t('m.Output')}} <span v-if="problem.io_mode.io_mode=='File IO'">({{$t('m.ToFile')}}: {{ problem.io_mode.output }})</span></h3>
          <p class="content" v-html=problem.output_description></p>
          <h3 class="title">{{$t('m.Sample')}}</h3>
          <div v-for="(sample, index) of problem.samples" :key="index">
            <div class="flex-container sample">
              <div class="sample-input">
                <p class="title" style="font-size: 15px;">{{$t('m.Sample_Input')}} #{{index + 1}}
                  <a class="copy"
                     v-clipboard:copy="sample.input" 
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onCopyError">
                    <Icon type="md-clipboard"></Icon>
                  </a>
                </p>
                <pre>{{sample.input}}</pre>
              </div>
              <div class="sample-output">
                <p class="title" style="font-size: 15px;">{{$t('m.Sample_Output')}} #{{index + 1}}
                  <a class="copy"
                     v-clipboard:copy="sample.output" 
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onCopyError">
                    <Icon type="md-clipboard"></Icon>
                  </a>
                </p>
                <pre>{{sample.output}}</pre>
              </div>
            </div>
          </div>

          <div v-if="problem.hint">
            <h3 class="title">{{$t('m.Hint')}}</h3>
            <Card dis-hover>
              <div class="content" v-html=problem.hint></div>
            </Card>
          </div>

          <div v-if="problem.source">
            <h3 class="title">{{$t('m.Source')}}</h3>
            <p class="content" v-html="problem.source"></p>
          </div>

        </div>
      </Panel>
      <!--problem main end-->
      <Card :padding="20" id="submit-code" ref="submit-code" dis-hover>
        <CodeMirror :value.sync="code"
                    :languages="problem.languages"
                    :language="language"
                    :theme="theme"
                    @resetCode="onResetToTemplate"
                    @changeTheme="onChangeTheme"
                    @changeLang="onChangeLang"></CodeMirror>
        <Row type="flex" justify="space-between">
          <Col :span="10">
            <div class="status" v-if="statusVisible">
              <template v-if="!this.contestID || (this.contestID && OIContestRealTimePermission)">
                <span>{{$t('m.Status')}}</span>
                <Tag v-if="this.contestID" type="dot" :color="submissionStatus.color" title="Click để xem chi tiết" @click.native="handleRoute('/status/'+submissionId+'?problem=' + problem._id + '&contest=' + contestID)">
                  {{$t('m.' + submissionStatus.text.replace(/ /g, "_"))}}  {{this.resultSummary}}
                </Tag>
                <Tag v-else type="dot" :color="submissionStatus.color" title="Click để xem chi tiết" @click.native="handleRoute('/status/'+submissionId+'?problem=' + problem._id)">
                  {{$t('m.' + submissionStatus.text.replace(/ /g, "_"))}}  {{this.resultSummary}}
                </Tag>
              </template>
              <template v-else-if="this.contestID && !OIContestRealTimePermission">
                <Alert type="success" show-icon>{{$t('m.Submitted_successfully')}}</Alert>
              </template>
            </div>
            <div v-else-if="problem.my_status === 0">
              <Alert type="success" show-icon>{{$t('m.You_have_solved_the_problem')}}</Alert>
            </div>
            <div v-else-if="this.contestID && !OIContestRealTimePermission && submissionExists">
              <Alert type="success" show-icon>{{$t('m.You_have_submitted_a_solution')}}</Alert>
            </div>
            <div v-if="contestEnded">
              <Alert type="warning" show-icon>{{$t('m.Contest_has_ended')}}</Alert>
            </div>
          </Col>

          <Col :span="12">
            <template v-if="captchaRequired">
              <div class="captcha-container">
                <Tooltip v-if="captchaRequired" content="Click to refresh" placement="top">
                  <img :src="captchaSrc" @click="getCaptchaSrc"/>
                </Tooltip>
                <Input v-model="captchaCode" class="captcha-code"/>
              </div>
            </template>
            <Button type="warning" icon="md-cloud-upload" :loading="submitting" @click="submitCode"
                    :disabled="problemSubmitDisabled || submitted"
                    class="fl-right">
              <span v-if="submitting">{{$t('m.Submitting')}}</span>
              <span v-else>{{$t('m.Submit')}}</span>
            </Button>
          </Col>
        </Row>
      </Card>
      <Card :padding="20" dis-hover>
        <h3 style="font-size: 20px;">Bình luận</h3>
        <ul style="margin-left: 30px;margin-top: 20px;">
          <li><a rel="nofollow noopener noreferrer" target="_blank" class="animation-text" href="https://gist.github.com/nguyenvanhieuvn/d3e5e20c44ef9d565fa3d7b9ebabfc65">Quy tắc thảo luận &#38; hướng dẫn đăng bình luận ✍️</a></li>
          <li><span style="font-weight: 600;">NÊN</span> thảo luận giải pháp 😘, <span style="font-weight: 600;">KHÔNG NÊN</span> chia sẻ code 😐</li>
          <li title="Không khuyến khích các bạn chia sẻ lời giải nha">Mọi source code đăng mà không được ẩn sẽ bị BOT xóa tự động 😭</li>
          <li title="BOT của Luyện Code cũng sẽ thường xuyên kiểm duyệt nha"><span style="font-weight: 600;">KHÔNG NÊN</span> để lộ thông tin cá nhân (SĐT, email, Facebook, ...)</li>
          <li>Tham gia thảo luận bài tập tại
            <span style="position: relative;">
              <a href="https://discord.gg/hpeRrbccfZ" target="_blank" style="position: absolute; left: 10px">
                <img alt="Discord" src="https://img.shields.io/discord/879371214806712340?label=Discord&logo=Discord">
              </a>
            </span>
          </li>
        </ul>
        <script type="application/javascript" src="https://utteranc.es/client.js" repo="luyencode/comments" issue-term="url" theme="github-light" crossorigin="anonymous" async> </script>
      </Card>
    </div>
    <div id="right-column">
      <VerticalMenu @on-click="handleRoute" style="cursor: pointer;">
        <template v-if="this.contestID">
          <VerticalMenu-item :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
            <Icon type="ios-photos"></Icon>
            {{$t('m.Problems')}}
          </VerticalMenu-item>

          <VerticalMenu-item :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
            <Icon type="md-chatbubbles"></Icon>
            {{$t('m.Announcements')}}
          </VerticalMenu-item>
        </template>

        <template v-if="!this.contestID">
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission" onclick="let e = document.getElementById('submit-code');window.scrollTo(0, e.offsetTop);">
            <Icon type="md-cloud-upload"></Icon>
              {{$t('m.Submit')}}
          </VerticalMenu-item>
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission" :route="submissionRoute">
            <Icon type="md-menu"></Icon>
              {{$t('m.Submissions')}}
          </VerticalMenu-item>
        </template>

        <template v-if="this.contestID">
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission"
                             :route="{name: 'contest-rank', params: {contestID: contestID}}">
            <Icon type="md-stats"></Icon>
            {{$t('m.Rankings')}}
          </VerticalMenu-item>
          <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}">
            <Icon type="md-home"></Icon>
            {{$t('m.View_Contest')}}
          </VerticalMenu-item>
        </template>
      </VerticalMenu>

      <Card id="info">
        <div slot="title" class="header">
          <Icon type="md-information-circle"></Icon>
          <span class="card-title">{{$t('m.Information_Problem')}}</span>
        </div>
        <ul>
          <li><p>ID</p>
            <p>{{problem._id}}</p></li>
          <li>
            <p>{{$t('m.Time_Limit')}}</p>
            <p>{{problem.time_limit}}MS</p></li>
          <li>
            <p>{{$t('m.Memory_Limit')}}</p>
            <p>{{problem.memory_limit}}MB</p></li>
          <li>
            <p>{{$t('m.IOMode')}}</p>
            <p>{{problem.io_mode.io_mode}}</p>
          </li>
          <li>
            <p>{{$t('m.Created')}}</p>
            <p>{{problem.created_by.username}}</p></li>
          <li v-if="problem.difficulty">
            <p>{{$t('m.Level')}}</p>
            <p>{{$t('m.' + problem.difficulty)}}</p></li>
          <li v-if="problem.total_score">
            <p>{{$t('m.Score')}}</p>
            <p>{{problem.total_score}}</p>
          </li>
          <li>
            <p>{{$t('m.Tags')}}</p>
            <p>
              <Poptip trigger="hover" placement="left-end">
                <a>{{$t('m.Show')}}</a>
                <div slot="content">
                  <Tag v-for="tag in problem.tags" :key="tag" @click.native="handleRoute('/problem?tag=' + tag)">
                    {{tag}}
                  </Tag>
                </div>
              </Poptip>
            </p>
          </li>
        </ul>
      </Card>

      <Card id="pieChart" :padding="0" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title">
          <Icon type="ios-analytics"></Icon>
          <span class="card-title">{{$t('m.Statistic')}}</span>
          <Button size="small" id="detail" @click="graphVisible = !graphVisible">{{$t('m.Details')}}</Button>
        </div>
        <div class="echarts">
          <ECharts :options="pie"></ECharts>
        </div>
      </Card>
      <Card style="margin-top: 20px;" :padding="0" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title" style="font-size: 16px"><i data-v-20c86fbe="" class="ivu-icon ivu-icon-md-document"></i>
        <span class="card-title">Bài tập mới</span>
        </div>
        <ul style="margin-left: 30px;margin-bottom: 20px;">
          <li style="padding: 5px 0px;"  v-for="p in problemList" :key="p.id">
            <a class="link-style" :href="'/problem/' + p._id">{{p._id}} - {{p.title}}</a>
          </li>
        </ul>
      </Card>
      <Card style="margin-top: 20px;" :padding="10" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title" style="font-size: 16px;"><i data-v-20c86fbe="" class="ivu-icon ivu-icon-md-heart" style="color: red; font-size:1.2em;"></i>
        <span class="card-title">Ủng hộ Luyện Code</span>
        </div>
        Ủng hộ 10.000đ giúp chúng tôi phát triển website hơn nữa:
        <ul style="margin-left: 20px;margin-bottom: 10px;">
          <li style="padding: 5px 0px;"><span style="color: green;">VPBank</span>: Nguyễn Văn Hiếu, STK: 146301158, chi nhánh Đông Đô</li>
          <li style="padding: 5px 0px;"><span style="color: green;">MoMo/Zalopay</span>: Nguyễn Văn Hiếu, SĐT: 0349346164</li>
          <li style="padding: 5px 0px;"><span style="color: green;">Paypal</span>: <a style="color: #495060;" target="_blank" href="https://www.paypal.me/nguyenvanhieuvn">paypal.me/nguyenvanhieuvn</a></li>
        </ul>
        Bạn cũng có thể tham gia đội đóng góp bài tập cho Luyện Code, liên hệ <a href="https://fb.com/hieunv.me" target="_blank">admin</a> để được hướng dẫn chi tiết.
      </Card>
    </div>
  
    <Modal v-model="graphVisible">
      <div id="pieChart-detail">
        <ECharts :options="largePie" :initOptions="largePieInitOpts"></ECharts>
      </div>
      <div slot="footer">
        <Button @click="graphVisible=false">{{$t('m.Close')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {types} from '../../../../store'
  import CodeMirror from '@oj/components/CodeMirror.vue'
  import storage from '@/utils/storage'
  import {FormMixin} from '@oj/components/mixins'
  import {JUDGE_STATUS, CONTEST_STATUS, buildProblemCodeKey} from '@/utils/constants'
  import api from '@oj/api'
  import {pie, largePie} from './chartData'
  // 只显示这些状态的图形占用
  const filtedStatus = ['-1', '-2', '0', '1', '2', '3', '4', '8']
  export default {
    name: 'Problem',
    components: {
      CodeMirror
    },
    mixins: [FormMixin],
    data () {
      return {
        statusVisible: false,
        captchaRequired: false,
        graphVisible: false,
        submissionExists: false,
        problemList: [],
        problemLimit: 10,
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1,
          orderby: '-create_time'
        },
        captchaCode: '',
        captchaSrc: '',
        contestID: '',
        problemID: '',
        submitting: false,
        code: '',
        language: 'C++',
        theme: 'solarized',
        submissionId: '',
        submitted: false,
        exited: false,
        result: {
          result: 9
        },
        problem: {
          title: '',
          description: '',
          hint: '',
          my_status: '',
          template: {},
          languages: [],
          created_by: {
            username: ''
          },
          totalTestCase: 0,
          ACTestCase: 0,
          resultSummary: '',
          tags: [],
          io_mode: {'io_mode': 'Standard IO'}
        },
        pie: pie,
        largePie: largePie,
        // echarts 无法获取隐藏dom的大小，需手动指定
        largePieInitOpts: {
          width: '500',
          height: '480'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let problemCode = storage.get(buildProblemCodeKey(to.params.problemID, to.params.contestID))
      let OverallCode = storage.get(buildProblemCodeKey('Overall'))
      if (problemCode) {
        if (problemCode.code !== '') {
          next(vm => {
            vm.language = problemCode.language
            vm.code = problemCode.code
            vm.theme = problemCode.theme
          })
        } else if (OverallCode) {
          next(vm => {
            vm.language = OverallCode.language
            vm.theme = OverallCode.theme
          })
        }
      } else if (OverallCode && problemCode === null) {
        next(vm => {
          vm.language = OverallCode.language
          vm.theme = OverallCode.theme
        })
      } else {
        next()
      }
    },
    mounted () {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: false})
      this.init()
      this.getProblemList()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.$Loading.start()
        this.contestID = this.$route.params.contestID
        this.problemID = this.$route.params.problemID
        let func = this.$route.name === 'problem-details' ? 'getProblem' : 'getContestProblem'
        api[func](this.problemID, this.contestID).then(res => {
          this.$Loading.finish()
          let problem = res.data.data
          this.changeDomTitle({title: problem.title})
          api.submissionExists(problem.id).then(res => {
            this.submissionExists = res.data.data
          })
          this.problem = problem
          this.changePie(problem)

          // 在beforeRouteEnter中修改了, 说明本地有code，无需加载template
          if (this.code !== '') {
            return
          }
          if (this.language !== 'C' && this.problem.languages.includes(this.language)) {
            return
          }
          // try to load problem template
          if (!this.language) {
            this.language = this.problem.languages[0]
          }
          let template = this.problem.template
          if (template && template[this.language]) {
            this.code = template[this.language]
          }
        }, () => {
          this.$Loading.error()
        })
      },
      getProblemList () {
        let offset = 0
        api.getProblemList(offset, this.problemLimit, this.query).then(res => {
          this.problemList = res.data.data.results
        })
      },
      changePie (problemData) {
        // 只显示特定的一些状态
        for (let k in problemData.statistic_info) {
          if (filtedStatus.indexOf(k) === -1) {
            delete problemData.statistic_info[k]
          }
        }
        let acNum = problemData.accepted_number
        let data = [
          {name: 'WA', value: problemData.submission_number - acNum},
          {name: 'AC', value: acNum}
        ]
        this.pie.series[0].data = data
        // 只把大图的AC selected下，这里需要做一下deepcopy
        let data2 = JSON.parse(JSON.stringify(data))
        data2[1].selected = true
        this.largePie.series[1].data = data2

        // 根据结果设置legend,没有提交过的legend不显示
        let legend = Object.keys(problemData.statistic_info).map(ele => JUDGE_STATUS[ele].short)
        if (legend.length === 0) {
          legend.push('AC', 'WA')
        }
        this.largePie.legend.data = legend

        // 把ac的数据提取出来放在最后
        let acCount = problemData.statistic_info['0']
        delete problemData.statistic_info['0']

        let largePieData = []
        Object.keys(problemData.statistic_info).forEach(ele => {
          largePieData.push({name: JUDGE_STATUS[ele].short, value: problemData.statistic_info[ele]})
        })
        largePieData.push({name: 'AC', value: acCount})
        this.largePie.series[0].data = largePieData
      },
      handleRoute (route) {
        this.$router.push(route)
      },
      onChangeLang (newLang) {
        if (this.problem.template[newLang]) {
          if (this.code.trim() === '') {
            this.code = this.problem.template[newLang]
          }
        }
        this.language = newLang
      },
      onChangeTheme (newTheme) {
        this.theme = newTheme
      },
      onResetToTemplate () {
        this.$Modal.confirm({
          content: this.$i18n.t('m.Are_you_sure_you_want_to_reset_your_code'),
          onOk: () => {
            let template = this.problem.template
            if (template && template[this.language]) {
              this.code = template[this.language]
            } else {
              this.code = ''
            }
          }
        })
      },
      checkSubmissionStatus () {
        // 使用setTimeout避免一些问题
        if (this.refreshStatus) {
          // 如果之前的提交状态检查还没有停止,则停止,否则将会失去timeout的引用造成无限请求
          clearTimeout(this.refreshStatus)
        }
        const checkStatus = () => {
          let id = this.submissionId
          api.getSubmission(id).then(res => {
            this.result = res.data.data
            try {
              this.totalTestCase = res.data.data.info.data.length
              this.ACTestCase = 0
              for (let tc of res.data.data.info.data) {
                if (tc.score > 0) {
                  this.ACTestCase += 1
                }
              }
              this.resultSummary = '(' + this.ACTestCase + '/' + this.totalTestCase + ')'
            } catch (e) {}
            if (Object.keys(res.data.data.statistic_info).length !== 0) {
              this.submitting = false
              this.submitted = false
              clearTimeout(this.refreshStatus)
              this.init()
            } else {
              this.refreshStatus = setTimeout(checkStatus, 2000)
            }
          }, res => {
            this.submitting = false
            clearTimeout(this.refreshStatus)
          })
        }
        this.refreshStatus = setTimeout(checkStatus, 2000)
      },
      submitCode () {
        if (this.code.trim() === '') {
          this.$error(this.$i18n.t('m.Code_can_not_be_empty'))
          return
        }
        this.submissionId = ''
        this.ACTestCase = 0
        this.totalTestCase = 0
        this.resultSummary = ''
        this.result = {result: 9}
        this.submitting = true
        let data = {
          problem_id: this.problem.id,
          language: this.language,
          code: this.code,
          contest_id: this.contestID
        }
        if (this.captchaRequired) {
          data.captcha = this.captchaCode
        }
        const submitFunc = (data, detailsVisible) => {
          this.statusVisible = true
          api.submitCode(data).then(res => {
            this.submissionId = res.data.data && res.data.data.submission_id
            // 定时检查状态
            this.submitting = false
            this.submissionExists = true
            if (!detailsVisible) {
              this.$Modal.success({
                title: this.$i18n.t('m.Success'),
                content: this.$i18n.t('m.Submit_code_successfully')
              })
              return
            }
            this.submitted = true
            this.checkSubmissionStatus()
          }, res => {
            this.getCaptchaSrc()
            if (res.data.data.startsWith('Captcha is required')) {
              this.captchaRequired = true
            }
            this.submitting = false
            this.statusVisible = false
          })
        }

        if (this.contestRuleType === 'OI' && !this.OIContestRealTimePermission) {
          if (this.submissionExists) {
            this.$Modal.confirm({
              title: '',
              content: '<h3>' + this.$i18n.t('m.You_have_submission_in_this_problem_sure_to_cover_it') + '<h3>',
              onOk: () => {
                // 暂时解决对话框与后面提示对话框冲突的问题(否则一闪而过）
                setTimeout(() => {
                  submitFunc(data, false)
                }, 1000)
              },
              onCancel: () => {
                this.submitting = false
              }
            })
          } else {
            submitFunc(data, false)
          }
        } else {
          submitFunc(data, true)
        }
      },
      onCopy (event) {
        this.$success('Đã sao chép vào khay nhớ tạm!')
      },
      onCopyError (e) {
        this.$error('Có lỗi rồi!')
      }
    },
    computed: {
      ...mapGetters(['problemSubmitDisabled', 'contestRuleType', 'OIContestRealTimePermission', 'contestStatus']),
      contest () {
        return this.$store.state.contest.contest
      },
      contestEnded () {
        return this.contestStatus === CONTEST_STATUS.ENDED
      },
      submissionStatus () {
        return {
          text: JUDGE_STATUS[this.result.result]['name'],
          color: JUDGE_STATUS[this.result.result]['type']
        }
      },
      submissionRoute () {
        if (this.contestID) {
          return {name: 'contest-submission-list', query: {problemID: this.problemID}}
        } else {
          return {name: 'submission-list', query: {problemID: this.problemID}}
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // 防止切换组件后仍然不断请求
      clearInterval(this.refreshStatus)

      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: true})
      storage.set(buildProblemCodeKey(this.problem._id, from.params.contestID), {
        code: this.code,
        language: this.language,
        theme: this.theme
      })
      storage.set(buildProblemCodeKey('Overall'), {
        language: this.language,
        theme: this.theme
      })
      next()
    },
    watch: {
      '$route' () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-title {
    margin-left: 8px;
  }
  .problem-title {
    text-align: center;
    font-size: 1.1em;
    font-weight: 400;
  }

  .flex-container {
    #problem-main {
      flex: auto;
      margin-right: 18px;
    }
    #right-column {
      flex: none;
      width: 300px;
    }
  }

  #problem-content {
    margin-top: -50px;
    word-break: break-word;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 8px 0;
      color: #191a1b;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
    .sample {
      align-items: stretch;
      &-input, &-output {
        width: 50%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        margin-right: 5%;
      }
      pre {
        flex: 1 1 auto;
        align-self: stretch;
        border-style: solid;
        background: transparent;
      }
    }
  }

  #submit-code {
    margin-top: 20px;
    margin-bottom: 20px;
    .status {
      float: left;
      cursor: pointer;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .captcha-container {
      display: inline-block;
      .captcha-code {
        width: auto;
        margin-top: -20px;
        margin-left: 20px;
      }
    }
  }

  #info {
    margin-bottom: 20px;
    margin-top: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 150px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  #pieChart {
    .echarts {
      height: 300px;
      width: 300px;
    }
    #detail {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }
  .animation-text {
    animation: color-change 1s infinite;
  }
  @keyframes color-change {
  0% { color: black; }
  50% { color: blue;}
  100% { color: red; }
}
.report {
  position: absolute;
  top: 25px; 
  right: 25px;
  opacity: 0.5; 
  color: #495060;
}
.report a {
  color: #495060;
}
.report a:hover {
  color: red;
}
</style>

