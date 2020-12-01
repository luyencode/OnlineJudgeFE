<template>
  <panel>
    <div slot="title">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="content markdown-body">
      <ul>
        <li>{{$t('m.Where_is_the_input_and_the_output')}} 
          <p>{{$t('m.Where_is_the_input_and_the_output_answer_part_1')}} <code>stdin</code> ('{{$t('m.Standard_Input')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_3')}} <code>stdout</code>
            ('{{$t('m.Standard_Output')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_5')}} <code>scanf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_6')}} <code>cin</code>
            {{$t('m.Where_is_the_input_and_the_output_answer_part_7')}} <code>printf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_8')}} <code>cout</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_9')}} <code>{{$t('m.Runtime_Error')}}</code>.
          </p>
        </li>
        <li>Điểm kinh nghiệm là gì?
          <p>Chức năng này đánh giá thứ hạng của bạn trên hệ thống. Bạn có thể Ghi danh hàng ngày và làm các bài tập để tăng điểm kinh nghiệm của mình. Khi điểm đạt đến một mức độ, bạn sẽ nhận được danh hiệu tương ứng.
          </p>
          <div>Cách tính điểm kinh nghiệm:
            <p>1. Nhận <code>1</code> cho mỗi lần ghi danh, vào các ngày thứ<code>3, 7, 15, 30, 60, 90, 120, 240, 365</code> của chuỗi, bạn sẽ nhận được<code>1,2,4, 7, 12, 20, 33, 54, 88</code> điểm kinh nghiệm（dãy Fibonacci đó)</p>
            <p>2. Đối với mỗi bài tập bạn vượt qua ở lần đầu tiên, bạn sẽ nhận được <code>3, 8, 15</code> điểm tương ứng với độ khó của bài tập đó (Dễ, Trung bình, Khó)</p>
          </div>
          <div>
            Quy đổi danh hiệu:
            <p>0 - 99 điểm: <Tag color="gray" style="margin-right:-15px;">Newbie</Tag></p>
            <p>100 - 199 điểm: <Tag color="green" style="margin-right:-15px;">Pupil</Tag></p>
            <p>200 - 499 điểm: <Tag color="green" style="margin-right:-15px;">Specialist</Tag></p>
            <p>500 - 999 điểm: <Tag color="blue" style="margin-right:-15px;">Expert</Tag></p>
            <p>1000 - 4999 điểm: <Tag color="#a0a" style="margin-right:-15px;">Candidate master</Tag></p>
            <p>5000 - 9999 điểm: <Tag color="#FF8C00" style="margin-right:-15px;">Master</Tag></p>
            <p>Từ hơn 9999 điểm: <Tag color="red" style="margin-right:-15px;">Grandmaster</Tag></p>
            <p>Chúng tôi chia làm 6 cấp danh hiệu, từ 0 - 6 và mỗi danh hiệu này sẽ có tiêu đề riêng</p>
          </div>
        </li>
        <li>{{$t('m.What_is_the_meaning_of_submission_execution_time')}} 
        <p>{{$t('m.What_is_the_meaning_of_submission_execution_time_answer')}} 
        </p>
        </li>
        <li>{{$t('m.How_Can_I_use_CPP_Int64')}} 
          <p>{{$t('m.How_Can_I_use_CPP_Int64_answer_part_1')}}<code>long long</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_2')}} <code>cin/cout</code> {{$t('m.or')}} <code>%lld</code>, {{$t('m.using')}}<code> __int64</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_3')}} <code>{{$t('m.Compile_Error')}}</code>.</p>
        </li>
        <li>{{$t('m.Java_specifications')}}
          <p>{{$t('m.Java_specifications_answer_part_1')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_2')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_3')}}</p>
        </li>
        <li>{{$t('m.About_presentation_error')}}
          <p>{{$t('m.About_presentation_error_answer_part_1')}} <b>{{$t('m.last')}}</b> {{$t('m.About_presentation_error_answer_part_2')}} <code> {{$t('m.Wrong_Answer')}}</code>.</p>
        </li>
        <li>{{$t('m.How_to_report_bugs')}}
          <p>{{$t('m.How_to_report_bugs_answer_part_1')}} <a href="https://fb.com/groups/LapTrinhKhongKho">Lập Trình Không Khó</a>
            {{$t('m.How_to_report_bugs_answer_part_2')}}
          </p>
        </li>
      </ul>
    </div>
  </panel>
</template>

<script>
</script>

<style lang="less" scoped>
  .content {
    font-size: 16px;
    margin: 0 50px 40px 50px;
    > ul {
      list-style: disc;
      li {
        font-size: 16px;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
        p {
          font-size: 14px;
          margin-top: 5px;
        }
      }
    }
  }
</style>