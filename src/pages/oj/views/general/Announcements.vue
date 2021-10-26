<template>
  <Row type="flex" :gutter="18">
    <Col :span="containerSpan">
      <Panel shadow :padding="10" >
        <div slot="title">
          {{title}}
        </div>
        <div slot="extra">
          <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading"><span class="ivu-icon ivu-icon-ios-refresh"></span> {{$t('m.Refresh')}}</Button>
          <Button v-else icon="ios-undo" @click="goBack">{{$t('m.Back')}}</Button>
        </div>
        <transition-group name="announcement-animate" mode="in-out">
          <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
            <p>{{$t('m.No_Announcements')}}</p>
          </div>
          <template v-if="listVisible">
            <ul class="announcements-container" key="list">
              <li v-for="announcement in announcements" :key="announcement.title">
                <div class="flex-container">
                  <div class="title"><a class="entry" @click="goAnnouncement(announcement)">
                    {{announcement.title}}</a></div>
                  <div class="date">{{announcement.create_time | localtime }}</div>
                  <div class="creator"> {{$t('m.By')}} {{announcement.created_by.username}}</div>
                </div>
              </li>
            </ul>
            <Pagination v-if="!isContest"
                        key="page"
                        :total="total"
                        :page-size="limit"
                        @on-change="getAnnouncementList">
            </Pagination>
          </template>

          <template v-else>
          <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
          </template>
        </transition-group>
      </Panel>
      <Row v-if="!isContest" type="flex" :gutter="10" style="margin-top: 70px;">
            <Col  :span="12">
              <Panel shadow style="padding-top: 0px;padding-bottom: 10px;">
                <div slot="title" style="margin-left: -10px;margin-bottom: -10px;">Bài tập mới</div>
                <ul style="margin-left: 40px;margin-bottom: 20px;">
                  <li style="padding: 5px 0px;"  v-for="p in problemList" :key="p.id">
                    <a class="link-style" :href="'/problem/' + p._id">{{p._id}} - {{p.title}}</a>
                  </li>
                </ul>
              </Panel>
            </Col>
            <Col  :span="12">
              <Panel shadow style="padding: 10px;padding-bottom: 10px;">
                <div slot="title" style="margin-left: -10px 0px 0px -20px;">{{$t('m.TagsTitle')}}</div>
                <Button v-for="tag in tagList"
                        :key="tag.name"
                        :disabled="query.tag === tag.name"
                        shape="circle"
                        class="tag-btn"><a class="link-style" :href="'/problem?tag=' + tag.name">{{tag.name}}</a>
                </Button>
              </Panel>
            </Col>
        </Row>
    </Col>
    <Col :span="5" v-if="!isContest" >
      <Panel shadow>
        <div style="font-size:14px; text-align:center; width:100%; line-height:16px; background: transparent; color:#636e72;">Rủ bạn bè vào cày rank thôi nào!</div>
        <div class="today">
          <div class="nowWeek">{{nowWeek}}</div>
          <div class="nowDate">
            {{nowDate}}
          </div>
        </div>
        <div v-if="days" style="margin:0 auto; margin-bottom:15px; font-size:12px; text-align:center; width:160px; line-height:16px; background: transparent; color:#636e72;">Bạn đã có <strong>{{days}} </strong> chuỗi ngày học</div>
        <div style="margin-top:-10px; margin:0 auto; font-size:14px; text-align:justify; width:80%; line-height:16px; background: transparent; color:#636e72;">{{word}}</div>
        <Button v-if="!SighinStatus" type="primary" icon="ios-alarm" @click="Sighin" long style="margin-top:20px; margin-bottom:20px; margin-left:10%; width:80%;">Ghi danh</Button>
        <Button v-else type="primary" icon="ios-alarm" long disabled style="margin-top:20px; margin-bottom:20px; margin-left:10%; width:80%;">
            Ghi danh
        </Button>
      </Panel>
      <Panel shadow style="margin-top: 37px;padding-bottom: 5px;">
        <div slot="title" style="margin-left: -10px;margin-bottom: -10px;">{{$t('m.Similar_Site')}}</div>
        <ul style="margin-left: 40px;margin-bottom: 20px;">
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://oj.vnoi.info/?ref=luyencode', '_blank');">VNOJ: VNOI Online Judge (🇻🇳)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://freecontest.net/?ref=luyencode', '_blank');">Free Contest (🇻🇳)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('http://csloj.ddns.net/?ref=luyencode', '_blank');">Chuyên Sơn La Online Judge (🇻🇳)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('http://ntucoder.net/?ref=luyencode', '_blank');">NTUCoder (🇻🇳)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://codeforces.com/?ref=luyencode', '_blank');">Codeforces (🇬🇧)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://leetcode.com/?ref=luyencode', '_blank');">LeetCode (🇬🇧)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://discord.gg/hpeRrbccfZ', '_blank');">Luyện Code: Hỏi & Đáp trên Discord (😘)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://www.facebook.com/groups/LapTrinhKhongKho/', '_blank');">Nhóm Lập Trình Không Khó (😘)</a></li>
          <li style="padding: 5px 0px;"><a href="#" class="link-style" onclick="event.preventDefault();window.open('https://nguyenvanhieu.vn/', '_blank');">Blog học Lập Trình Không Khó (😘)</a></li>
        </ul>
      </Panel>
    </Col>
  </Row>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'
  import { mapState } from 'vuex'

  export default {
    name: 'Announcement',
    components: {
      Pagination
    },
    data () {
      return {
        limit: 10,
        total: 10,
        tagList: [],
        problemList: [],
        problemLimit: 15,
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1,
          orderby: '-create_time'
        },
        btnLoading: false,
        announcements: [],
        announcement: '',
        listVisible: true,
        timer: null,
        containerSpan: 19,
        SighinStatus: false,
        nowWeek: '',
        nowDate: '',
        word: '',
        days: 0
      }
    },
    mounted () {
      this.init()
      this.timer = setInterval(() => {
        this.setNowTimes()
      }, 1000)
      this.getWord()
      this.isSighin()
      this.getProblemList()
      this.getTagList()
    },
    methods: {
      init () {
        if (this.isContest) {
          this.containerSpan = 24
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList()
        }
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          this.tagList = res.data.data.sort((a, b) => {
            return a.id - b.id
          })
        })
      },
      getProblemList () {
        let offset = 0
        api.getProblemList(offset, this.problemLimit, this.query).then(res => {
          this.problemList = res.data.data.results
        })
      },
      getAnnouncementList (page = 1) {
        this.btnLoading = true
        api.getAnnouncementList((page - 1) * this.limit, this.limit).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestAnnouncementList () {
        this.btnLoading = true
        api.getContestAnnouncementList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goAnnouncement (announcement) {
        this.announcement = announcement
        this.listVisible = false
      },
      goBack () {
        this.listVisible = true
        this.announcement = ''
      },
      getWord () {
        // axios.get('https://v1.hitokoto.cn/?c=d&c=e&c=f&c=h&c=i&c=j&c=k').then(response => {
        //   this.word = response.data.hitokoto
        // })
        let quotes = ['Thêm một chút bền bỉ, một chút nỗ lực, và điều tưởng chừng như là thất bại vô vọng có thể biến thành thành công rực rỡ', 'Cái người đời thường thiếu là ý chí chứ không phải là sức mạnh', 'Anh có thể bắt trượt mục tiêu nếu nhắm quá cao hoặc quá thấp', 'Để thành công, hãy chớp lấy cơ hội cũng nhanh như khi vội vã kết luận', 'Thất bại trong chuẩn bị cũng có nghĩa là chuẩn bị thất bại', 'Cuối cùng, điều quan trọng nhất là con người bạn trở thành chứ không phải điều bạn đạt được', 'Không phải người ta ngừng theo đuổi giấc mơ vì mình già đi, người ta già đi vì ngừng theo đuổi giấc mơ', 'Đừng bao giờ cúi đầu. hãy luôn ngẩng cao. nhìn thẳng vào mắt thế giới', 'Để thành công, thái độ cũng quan trọng ngang bằng khả năng', 'Chúng ta thường không biết quý trọng những thứ đạt được quá dễ dàng', 'Thay vì lo lắng người khác nói gì về mình, sao bạn không bỏ thời gian cố đạt được điều khiến họ phải khâm phục', 'Sửa mình làm cung, uốn ý tưởng làm tên, lấy nghĩa vững làm đích, ngắm cho ngay rồi bắn ra, bắn ra tất phải trúng đích', 'Hãy để ý xem bạn đang đi đâu, vì nếu không có ý nghĩa, bạn có thể sẽ chẳng tới được đâu', 'Sự thành công thường đến với những ai không quá bận rộn đi tìm nó', 'Quyết đoán là một tính cách của những người đàn ông và phụ nữ năng động. quyết định nào cũng hơn là không có quyết định', 'Người ta hiếm khi thành công nếu không làm điều mình thấy vui thích', 'Hãy nắm lấy cơ hội! tất cả cuộc đời là cơ hội. người tiến xa nhất thường là người sẵn sàng hành động và chấp nhận thách thức', 'Tôi không thất bại, tôi chỉ tìm ra một trăm cách làm sai thôi', 'Chìa khóa thành công là tập trung lý trí của chúng ta vào những điều chúng ta muốn chứ không phải những điều chúng ta sợ', 'Không rắc rối nào đứng vững được trước cuộc tấn công của suy nghĩ kiên trì', 'Những thành tựu vĩ đại không được gặt hái bằng sức mạnh mà bằng sự kiên trì', 'Nấc thang thành công không quan tâm ai đang trèo nó', 'Bí quyết của thành công là hãy bắt đầu. bí quyết để bắt đầu là chia nhỏ các công việc nặng nề, phức tạp thành những việc nhỏ dễ quản lý hơn, rồi bắt đầu với việc thứ nhất', 'Cơ bản là có hai loại người. người làm nên chuyện và người tuyên bố mình làm nên chuyện. nhóm đầu tiên ít đông hơn', 'Lời giả dối làm rối loạn tâm thiện. không nhịn được điều nhỏ nhặt sẽ làm hư chuyện đại sự', 'Ăn mừng thành công cũng tốt, nhưng quan trọng hơn là phải biết chú ý đến những bài học của sự thất bại', 'Thành công là một người thầy tồi tệ. nó quyến rũ những người thông minh vào ý nghĩ rằng họ sẽ chẳng bao giờ thất bại', 'Đừng mong đích đến sẽ thay đổi nếu như bạn không thay đổi con đường', 'Chúng tôi sẽ làm tất cả để thành công. đơn giản bởi chúng tôi là những người trẻ và chúng tôi không bao giờ biết từ bỏ', 'Mọi công việc thành đạt đều nhờ sự kiên trì và lòng say mê. ngạn ngữ tây ban nha', 'Thành đạt không phải do sự giúp đỡ của người khác mà chính do lòng tự tin', 'Muốn thành công thì khao khát thành công phải lớn hơn nỗi sợ bị thất bại', 'Mức độ thành công được xác định không phải bởi những gì ta đã đạt được, mà bởi những trở ngại ta đã vượt qua', 'Bạn càng thành công thì ở gần bạn càng ít người vui vì sự thành công của bạn', 'Thành công của chúng ta không phải là những gì mà ta đang sở hữu mà là những gì ta sẽ để lại', 'Câu nói hay về sự thành công, cố gắng, nỗ lực', 'Thành công không phụ thuộc vào kiến thức mà vào cách áp dụng kiến thức', 'Không phải lúc nào bạn cố gắng cũng thành công nhưng phải luôn cố gắng để không hối tiếc khi thất bại', 'Thành công là việc sử dụng tối đa khả năng mà bạn có', 'Thành công không bao giờ được đo bằng bao nhiêu tiền bạn có', 'Dù người ta có nói với bạn điều gì đi nữa, hãy tin rằng cuộc sống là điều kỳ diệu và đẹp đẽ', 'Con người sinh ra không phải để tan biến đi như một hạt cát vô danh. họ sinh ra để in dấu lại trên mặt đất, in dấu lại trong trái tim người khác', 'Đời là cuộc đấu tranh liên tục; nó luôn được cải biên với những khó khăn mới. và chúng ta sẽ chiến thắng nhưng bao giờ cũng phải trải giá', 'Hãy hướng về phía mặt trời bạn sẽ không thể nhìn thấy bóng tối. đó là những gì hoa hướng dương đang làm', 'Trí tuệ của con người trưởng thành trong tĩnh lặng, còn tính cách trưởng thành trong bão táp', 'Hãy sống tốt đẹp đi và nhớ rằng, mỗi ngày có một đời sống riêng cho nó thôi', 'Bạn có yêu đời không? vậy đừng phung phí thời gian vì chất liệu của cuộc sống được làm bằng thời gian', 'Chúng ta có bốn mươi triệu lý do về sự thất bại nhưng không có một lời bào chữa nào', 'Chưa thử sức thì không bao giờ biết hết năng lực của mình', 'Đừng để đến ngày mai những việc gì anh có thể làm hôm nay', 'Nếu không vấp phải một trở ngại nào nữa, tức là bạn đã đi chệch đường rồi đó', 'Hãy học cách sống vượt thành công của người khác. a.fuirstenbeg', 'Điều tôi muốn biết trước tiên không phải là bạn đã thất bại ra sao mà là bạn đã chấp nhận nó như thế nào', 'Thành công chỉ đến khi bạn làm việc tận tâm và luôn nghĩ đến những điều tốt đẹp', 'Không có nghèo gì bằng không có tài, không có gì hèn bằng không có chí', 'Kẻ nào không muốn cúi xuống lượm một cây kim thì không đáng có một đồng bạc', 'Thành công là một cuộc hành trình chứ không phải là điểm đến. a.moravia', 'Người bị vấp ngã là người dám liều mình. qua cách họ đối phó với sai lầm, ta có thể đoán dược cách họ giải quyết khó khăn trong tương lai', 'Đời là cuộc đấu tranh liên tục; nó luôn được cải biên với nhưng khó khăn mới. và chúng ta sẽ chiến thắng nhưng bao giờ cũng phải trải giá', 'Không có con đường nào dài quá đối với kẻ bước đi thong thả, không vội vàng. không có cái lợi nào xa xôi quá đối với những kẻ kiên nhẫn làm việc', 'Thành đạt không phải ở người giúp đỡ mà chính do lòng tự tin', 'Hãy làm tròn mỗi công việc của đời mình như thể đó là công việc cuối cùng', 'Đường đi khó không phải vì ngăn sông cách núi . mà khó vì lòng người ngại núi e sông', 'Muốn cầu tiến hơn người, ra đời phải biết ngước mặt nhìn lên. vì nhìn xuống ta thấy hơn người, nhưng nhìn lên ta chỉ là con số không vĩ đại', 'Biết điều mà ai cũng biết là không biết gì hết. cái biết chỉ bắt đầu ở chỗ mà mọi người không biết', 'Ai than thở không bao giờ có thời gian, người ấy làm được ít việc nhất', 'Tất cả mọi người đều ao ước có được nhiều hiểu biết, điều kiện đầu tiên là phải biết nhìn đời với cặp mắt của đứa trẻ thơ, cái gì cũng mới lạ và làm cho ta ngạc nhiên cả', 'Biết bao kẻ đọc sách và học hỏi, không phải để tìm ra chân lý mà là để gia tăng những gì mình đã biết', 'Tôi chưa bao giờ gặp một người nào mà tôi không tìm thấy nơi họ một cái gì đáng cho tôi học hỏi', 'Chỉ những kẻ nào có nhẫn nại làm được hoàn toàn những việc dễ mới biết nghệ thuật làm được dễ dàng những việc khó', 'Con ong được ca tụng vì nó làm việc không phải cho chính mình nhưng cho tất cả', 'Có 3 thứ ngu dốt: không biết những gì mình cần biết, không rành những gì mình biết và biết những gì mình không cần biết', 'Người anh hùng vĩ đại nhất là người làm chủ được những ước mơ của mình', 'Nếu bạn muốn giầu có thì chẳng những phải học cách làm ra tiền mà còn phải học cách sử dụng đồng tiền', 'Làm việc đừng quá trông đợi vào kết quả, nhưng hãy mong cho mình làm được hết sức mình', 'Chiến thắng bản thân là chiến thắng hiển hách nhất', 'Kẻ hoang phí sẽ là kẻ ăn mày trong tương lai. kẻ tham lam là kẻ ăn mày suốt đời', 'Đi vòng mà đến đích còn hơn đi thẳng mà ngã đau', 'Lý tưởng ấp ủ trong tâm trí sẽ tạo nên những hành vi phù hợp với lý tưởng', 'Học trò xoàng xĩnh là học trò không vượt được thầy', 'Hãy tham khảo ý kiến người khác cho kỹ càng trước khi bắt tay vào việc, và khi đã quyết định rồi thì hãy hành động ngay tức khắc', 'Ba cái nền tảng của học vấn là: nhận xét nhiều, từng trải nhiều và học tập nhiều', 'Bí quyết lớn nhất của thành công là thành thật. không thành thật, không có phương pháp nào đắc dụng với bạn hết', 'Câu trả lời gọn nhất là hành động', 'Đường tuy gần không đi không bao giờ đến, việc tuy nhỏ không làm chẳng bao giờ nên', 'Người quan tâm đến thành công phải học cách xem thất bại như là một phần lành mạnh, không thể tránh khỏi của quá trình lên đến vị trí cao nhất', 'Nhiều thất bại trong cuộc sống là do lúc bỏ cuộc, người ta không nhận ra họ đã gần thành công đến mức nào rồi', 'Người chiến thắng khiến cho sự việc xảy ra, kẻ chiến bại để sự việc xảy ra', 'Đừng sợ thất bại. không phải thất bại, mà chính mục tiêu thấp kém mới là tội lỗi. khi bạn nỗ lực hết mình, ngay cả sự thất bại cũng vẻ vang', 'Những người tốt được ca ngợi vì họ đến với sự thông thái bằng cách thông qua những thất bại. bạn biết đấy, chúng ta có được rất ít kiến thức từ sự thành công', 'Nếu bạn lo sợ thất bại thì bạn không xứng đáng để thành công', 'Ai chiến thắng mà không hề chiến bại. ai nên khôn mà chẳng dại đôi lần', 'Hãy học cách sống vượt thành công của người khác', 'Những người không đạt được thành công thường bị tâm trạng thất vọng chặn lại. tất cả những người thành công đều biết rằng thành công được che giấu ở mặt bên kia của sự thất vọng. thật không may, một số người không đến được mặt bên đó', 'Khi tôi còn trẻ, tôi chú ý thấy 9 trong 10 việc tôi làm là thất bại. tôi không muốn bị thất bại nên tôi đã làm việc nhiều hơn gấp 10 lần', 'Chính cách bạn xử trí thất bại quyết định cách bạn đạt được thành công', 'Thất bại là tốt, miễn là nó không trở thành một thói quen', 'Thành công chỉ thực sự đạt được bởi những người biết thất bại có ý nghĩa quan trọng thế nào', 'Chỉ có những người dám thất bại một cách đau đớn mới có thể thành công một cách vĩ đại', 'Chỉ vì bạn đã từng thất bại, không có nghĩa là bạn sẽ mãi thất bại trong mọi việc. hãy tiếp tục cố gắng, kiên trì, và luôn luôn, luôn luôn, luôn luôn tin vào chính bạn, bởi vì nếu không thì ai sẽ tin bạn đây?', 'Những câu nói hay về thành công và thất bại-3', 'Trong sự đương đầu giữa dòng suối và hòn đá, dòng suối luôn luôn thắng, không phải qua sức mạnh mà bằng sự bền bỉ', 'Tôi có thể chưa đến được nơi đó, nhưng tôi đã đến gần hơn so với vị trí của tôi ngày hôm qua', 'Một người thắng cuộc khi phạm lỗi nói: “tôi đã sai”. còn một người thua cuộc khi phạm sai lầm nói: “đó không phải là lỗi của tôi”', 'Tất cả mọi người vấp ngã ở một số tình huống nào đó trong cuộc sống của họ. điều duy nhất khiến họ khác biệt chính là cách họ cố gắng để đứng dậy hay cách họ chọn để vấp ngã lần nữa', 'Thành công hay thất bại được tạo ra bởi một thái độ về tinh thần hơn là một khả năng về trí tuệ', 'Bạn không học đi bằng cách làm theo các nguyên tắc, bạn học bằng cách thực hành, và vấp ngã', 'Mọi công việc thành đạt đều nhờ sự kiên trì và lòng say mê', 'Bạn luôn phải vượt qua thất bại trên con đường đến với thành công', 'Thất bại không phải là ngã, mà là từ chối đứng dậy', 'Bỏ cuộc chắc chắn là cách duy nhất để thất bại', 'Có hai loại người trên thế giới này, đó là những người tìm kiếm nguyên nhân và những người đi tìm thành công. loại người tìm kiếm nguyên nhân luôn luôn cố tìm cho ra những nguyên nhân tại sao công việc không được hoàn thành. còn những người đi tìm thành công luôn luôn tìm hiểu những lý do tại sao công việc có thể hoàn thành', 'Không có thành công thực sự nào mà không bị phản đối, bạn càng tiến bộ hơn, học hỏi được nhiều hơn và càng tiến gần hơn đến thành quả của mình', 'Nhiều người ước mơ được thành công. thành công chỉ có thể đạt được qua thất bại và sự nội quan liên tục. thật ra, thành công thể hiện 1% công việc ta làm - kết quả có được từ 99% cái gọi là thất bại', 'Bạn không thể sống mà chưa từng thất bại ở một việc gì đó, ngoại trừ bạn sống quá cẩn trọng đến mức không thể được xem là sống nữa - khi đó, mặc định là bạn đã thất bại rồi', 'Thất bại mang lại cho bạn cái nhìn đúng đắn về sự thành công', 'Hãy suy nghĩ như một bà hoàng. một bà hoàng không sợ thất bại. thất bại chỉ là một bước đệm khác để đến với sự vĩ đại', 'Trong thế giới thật, có những người rất thông minh thất bại và những người bình thường lại nổi lên. điều khiến một người thành công hay thất bại chẳng liên quan gì đến iq cả. thêm vào đó, việc cho rằng trí thông minh có thể được đánh giá qua một bài kiểm tra iq là sai lầm', 'Những câu nói hay về thành công và thất bại-5', 'Những người thành công không sợ thất bại. họ hiểu rằng thất bại là cần thiết để học hỏi và đi lên từ đó', 'Thất bại sẽ không bao giờ chiến thắng tôi, nếu như quyết tâm thành công của tôi là đủ lớn', 'Hãy luôn sợ phải hối tiếc, hơn là sợ phải thất bại', 'Thế giới đầy rẫy sự dư dả và cơ hội, nhưng có quá nhiều người đến với suối nguồn của cuộc sống mà chỉ mang theo một chiếc rây thay vì một chiếc xe bồn… một thìa uống trà thay vì một chiếc máy xúc. họ mong đợi ít và kết quả là họ nhận được ít', 'Thành công là khả năng đi từ thất bại này đến thất bại khác mà không mất đi nhiệt huyết', 'Không ai có được bảo đảm chắc chắn thành công. chắc chắn những yếu tố như cơ hội, sự may mắn và thời điểm là quan trọng. nhưng xương sống của thành công thường được tìm thấy trong các khái niệm cơ bản, cổ hủ như làm việc chăm chỉ, quyết tâm, lên kế hoạch cẩn thận và kiên trì', 'Hãy học cách hạnh phúc với những gì bạn có trong khi bạn đang theo đuổi tất cả những gì mình mơ ước']
        this.word = quotes[Math.floor(Math.random() * quotes.length)] + '.'
      },
      setNowTimes () {
        let myDate = new Date()
        let weeks = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
        let mouth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        this.nowDate = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()) + '/' + mouth[myDate.getMonth()] + '/' + myDate.getFullYear()
        this.nowWeek = weeks[myDate.getDay()]
      },
      isSighin () {
        api.GetSighinStatus().then(res => {
          if (res.data.data === null || res.data.data.sighinstatus === 'false') {
            this.SighinStatus = false
          } else {
            this.SighinStatus = true
          }
          this.days = res.data.data !== null ? res.data.data.continue_sighin_days : 0
        })
      },
      Sighin () {
        api.UserSighin().then(res => {
          if (res.data.data === 'Singined') {
            this.$Notice.error({
              title: 'Ghi danh không thành công',
              desc: 'Bạn ghi danh hôm nay rồi, hãy quay lại vào ngày mai nhé'
            })
            this.isSighin()
          } else {
            this.$Notice.success({
              title: 'Ghi danh thành công',
              desc: 'Chúc mừng bạn có thêm ' + (res.data.data.experience) + ' điểm kinh nghiệm, nhớ quay lại vào ngày mai nhé.'
            })
            this.days += 1
            this.SighinStatus = true
          }
        })
      }
    },
    computed: {
      ...mapState(['website']),
      title () {
        if (this.listVisible) {
          return this.isContest ? this.$i18n.t('m.Contest_Announcements') : this.$i18n.t('m.Announcements')
        } else {
          return this.announcement.title
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>

<style scoped lang="less">
  .announcements-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      padding-top: 15px;
      list-style: none;
      padding-bottom: 15px;
      margin-left: 20px;
      font-size: 16px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      &:last-child {
        border-bottom: none;
      }
      .flex-container {
        .title {
          flex: 1 1;
          text-align: left;
          padding-left: 10px;
          a.entry {
            color: #495060;
            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }
        .creator {
          flex: none;
          width: 200px;
          text-align: center;
        }
        .date {
          flex: none;
          width: 200px;
          text-align: center;
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-announcement {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .announcement-animate-enter-active {
    color: rgba(255, 255, 255, 0.5);
    animation: fadeIn 1s;
  }
  .nowWeek {
    text-align: center;
    padding-top: 20px;
    font-size: 25px;
    font-weight: 600;
  }
  .nowDate {
    text-align: center;
    padding-bottom: 10px;
    font-size: 30px;
    font-weight: 600;
  }
  .tag-btn {
    margin-right: 10px;
    margin-bottom: 20px;
  }
  .tag-btn:hover {
    a {
       color: #2d8cf0;
    }
  }
  .link-style {
    color:#264c67
  }
  .link-style:hover {
    color: #2d8cf0;
  }
</style>
