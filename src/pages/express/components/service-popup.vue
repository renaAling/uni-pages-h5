<template>
  <up-popup :show="isPopupShow" closeable @close="onPopupClose">
    <view class="service-popup">
      <view class="top-title">《服务协议》</view>
      <view class="cut-off"></view>
      <scroll-view class="service-content" scroll-y>
        <view class="flex-vhc">
          <view class="title">一、总则</view>
          <view class="content">
            1.1&nbsp;本服务协议是轨道生活通小程序（以下简称“平台”）与用户（以下简称
            “寄件人”）之间达成的快递及闪送服务合同。本协议在您下电子运单前通过勾选的形式在线签署。在线签署并下单后，即表示您已接受协议的全部内容，在您与平台间发生法律效力。请您在务必仔细阅读、充分理解后再决定勾选并下单，若您不同意本协议全部或任何内容，您应停止使用寄快递或闪送服务。
          </view>
          <view class="content">
            1.2&nbsp;本协议构成部分包括本条款和条件、运单信息、平台隐私政策及各类规则、服务细则、通知等相关文件。平台有权对本协议进行修改，修改内容将提前七天在轨道生活通小程序进行公示，公示期满后自动生效。
          </view>
          <view class="title">二、您的义务</view>
          <view class="content">
            2.1&nbsp;请您提交本人真实信息登录轨道生活通账号，并妥善保管该等账号。通过您的账号进行的下单等操作行为视为您本人行为。您确认现场交付快件为您本人。若由他人代为交付您订单对应的快件，视为该第三人已获得您完全授权。
          </view>
          <view class="content">
            2.2&nbsp;您需承诺您是托寄物的合法处置人，保证对货物享有所有权或独立处分权。
          </view>
          <view class="content">
            2.3&nbsp;请您如实填写或提供运单所有信息，包括但不限于托寄物名称、性质、数量和价值，以及寄件人、收件人的名称、地址、联系电话，并保证该等资料都是真实、完整和准确的。特别提示：若如您填写的寄件人不是您本人，视为该人员是您完全授权的寄件人，代表您享有寄件人的权利和义务。您作为下单人与寄件人就您的订单承担连带责任，包括但不限于支付运费。
          </view>
          <view class="content">
            2.4&nbsp;您应确保快件在准备、寄递过程中平台服务免受他人不当干扰。
          </view>
          <view class="content">
            2.5&nbsp;您在交付寄递前需对托寄物进行妥善包装，尤其是内含易碎品、液体、气体等托寄物，您需提供充分的防破损、防漏、防爆措施，使托寄物适用于安全配送。若您自行提供快件封装用品和胶带的，您需严格遵守有关国家规定，不得违规使用禁止及限制使用的封装材料。
          </view>
          <view class="content">
            2.6&nbsp;遵守《禁止寄递物品管理规定》等法律法规的规定，不予寄递国家法律法规规定的禁止或限制寄递的物品。若该等规范性法律文件发生变更，平台将按有关国家机关发布及更新的最新规定为准提供服务。<br />平台在任何时候发现您交付的物品不符合禁止或限制寄递的物品的有关规定的，有权移交相关部门处理。
          </view>
          <view class="content">
            2.7&nbsp;托寄物需要办理审批、检验等手续的，您应向平台提交办理完相关手续的证明文件。
          </view>
          <view class="content">
            2.8&nbsp;出示有效证件，以符合实名寄递的有关法律规定。
          </view>
          <view class="title">三、平台的义务</view>
          <view class="content">
            出于安全及法律法规的要求，平台有权对快件进行当场开箱验视及安全检查，对禁寄及拒绝验视的快件不予收寄。免生疑问，平台不会对因上述查验而导致的任何延误造成的损失负责。
            平台向寄件人提供自交寄之日起一年内的查询服务。
          </view>
          <view class="title">四、服务内容及费用</view>
          <view class="content">
            4.1&nbsp;服务类型<br />
            （1）普通快递：提供文件、包裹等物品的标准化运输配送服务，时效根据同城、省内
            ，跨省距离的不同有所差异。<br />
            （2）闪送服务：提供
            同城“专人直送”加急服务，具体时效根据同城距离测算，以下单页面实际显示为准。
          </view>
          <view class="content">
            4.2&nbsp;服务费用<br />
            （1）快件服务的运费及附加服务费的计费标准以平台上所公示的当期计费标准为准，平台可以根据市场环境的变化不时的合理变更价格。如地址不正确、联系方式错误、收件人拒收等原因而造成无法派送的快件，若您要求退回，则双程费用均由您承担。<br />
            （2）附加服务费及资源调节费<br />
            您指示在物流中心、保税区等需要支付出/入仓费或其他额外费用的特殊地址收取或派送快件时，您或您指定付款人应当偿还平台物流垫付的额外费用，并向平台支付附加服务费。<br />
            （3）若您或您指定的付款人未付清费用的，平台有权留置托寄物，留置期限为3个月（自揽收快件之日起计算），但托寄物性质不能留置的除外。平台将通过电话等方式通知您配合平台行使留置权的，通知发出后7日内您未书面答复平台的，视为您同意平台行使留置权的方案。平台行使留置权，不影响平台在法律允许的范围内根据本合同享有的其他权益。<br />
            （4）无法投递的快件，平台会联系您处理，若您指示放弃货物，平台取得该货物处置权限；若您指示退回，或7日内未明确指示弃货或退回，将对快件进行退回，退回运费由您承担。若由于您的原因造成快件无法退回的，平台有权根据《无法投递又无法退回快件管理规定》等规范性法律文件进行相应操作及处置，因此产生的保管费、处置费等费用由您承担。因非平台原因导致自首次投递之日起3日内无法派送成功的，平台有权将托寄物按作废件处理并不承担任何责任。
          </view>
          <view class="content">
            4.3&nbsp;快件服务费用为寄付现结的结算方式，支持微信支付。您需在每次交付快件后结算该快件的费用。特别提示您：请您及时付款，因您未及时支付导致无法投递、无法退回或时效延误的，平台不承担责任。
          </view>
          <view class="content">
            4.4&nbsp;计费标准<br />
            （1）普通快递：根据物品重量、体积、运输距离计算费用，具体以下单时平台显示金额为准。<br />
            （2）闪送服务：基础费用 + 距离费 + 重量费，不足 1 公斤按
            1公斤计算，超过 20 公斤加收超重费。
          </view>
          <view class="title">五、赔偿服务</view>
          <view class="content">
            5.1&nbsp;因平台原因，托运物发生损毁或丢失，平台按照托运物金额和损失的比例向您赔偿，最高不超过托运物的实际损失金额。
          </view>
          <view class="content">
            5.2&nbsp;平台若对托寄物进行全额理赔后，托寄物尚有残值的，归平台所有。如托寄物归您所有，平台有权在全部赔偿金额中直接扣减托寄物残值后向您赔付。
          </view>
          <view class="content">
            5.3&nbsp;索赔的时间要求：除非与相关适用法律冲突，任何索赔必须在平台妥投托运物后的24小时内联系平台客服提出并附上相应证明材料，否则平台将不再承担任何责任。若所有快递服务费用尚未被支付，平台无义务受理任何索赔。索赔金额不可用该快递服务费用抵消。作为理赔的条件，平台有权对原托运物和包装材料进行检查。
          </view>
          <view class="content">
            5.4&nbsp;下列情形及导致的托运物毁损、灭失、延误派送、无法派送及其他损失的，平台不承担赔偿责任：<br />
            （1）因不可抗力因素造成的。“不可抗力”是指无法预测、无法控制或无法避免的客观因素或意外事件。<br />
            （2）其他外部因素造成的，包括但不限于地震、火灾、雪灾、暴风雨、大雾等恶劣天气；罢工、恐怖事件、疫情、意外交通事故、法规政策的修改、政府、司法机关的行为、决定或命令；抢劫、飞车抢夺等暴力犯罪。<br />
            （3）生鲜类物品在平台展示的预计送达时效内送达，但送达时腐烂、损坏的。<br />
            （4）生鲜类物品货物已当面验货签收，妥投24小时后您反馈货物损坏、腐烂、短少的。<br />
            （5）因您不同意拆封托运物原销售包装，妥投时原包装无损且无拆封痕迹的，包装内物出现毁损、灭失、短少的。<br />
            （6）您基于托运物可能获得的收益、实际用途、商业机会等任何间接损失。<br />
            （7）因托运物的自然性质、内在缺陷或合理损耗造成的。<br />
            （8）非平台过错造成的，包括但不限于您没有如实申报托寄物资料，您交付的托运物属于法律法规明文规定及本合同约定禁止寄递或限制寄递的，您对托运物包装不当，收货人迟延受领托运物等情形。<br />
            （9）其他法律规定或双方约定平台免于赔偿的情形。
          </view>
          <view class="title">六、签收</view>
          <view class="content">
            平台将快件投递至收件人地址和收件人或收件人（寄件人)允许的代收人，视为送达。若收件人在签收托运物时没有在运单记录上注明有任何损坏，则该托运物被视为完好送达。若无收件人姓名，仅有收货单位地址的，投递至单位地址，由单位收件人员签收，或盖单位收发章，视为送达。
          </view>
          <view class="title">七、禁止寄递物品</view>
          <view class="content">
            7.1&nbsp;以下物品禁止寄递：<br />
            （1）法律法规禁止流通或运输的物品（如枪支弹药、易燃易爆品、毒品等）；<br />
            （2）危险品、管制器具及其他危害运输安全的物品；<br />
            （3）国家保护野生动物及其制品、假冒伪劣商品；<br />
            （4）货币、不记名票据、贵重金属、珠宝玉器等贵重物品；<br />
            （5）生鲜果蔬类价值超过 2 万元的物品；<br />
            （6）动物及其制品（法律法规另有规定的除外）。
          </view>
          <view class="content">
            7.2&nbsp;闪送服务额外限制：<br />
            （1）单件重量超过 30 公斤的物品；<br />
            （2）体积超过 0.5 立方米的物品；<br />
            （3）需要特殊温控的生物制品。
          </view>
          <view class="title">八、信息保护</view>
          <view class="content">
            您同意平台按照法律法规和隐私政策的规定处理您提供的运单信息。平台为保护您的个人信息，可能使用保密运单，平台会对您寄件时在平台下单系统录入的信息予以保存。对于保密运单所隐匿的信息，您同意以平台系统所查询的内容为准。
          </view>
          <view class="title">九、法律适用</view>
          <view class="content">
            本契约条款未约定或约定不明，且双方未达成补充约定的，按照中华人民共和国相关法律法规和国家标准的规定执行。平台客服联系方式：028-67875895，工作时间：9:00-18:00。
          </view>
          <view class="title">十、争议解决</view>
          <view class="content">
            本条款履行过程中如发生争议，双方应友好协商解决。如协商不成的，应向快件寄出地有管辖权的人民法院提起诉讼。
          </view>
        </view>
      </scroll-view>
      <!-- 底部按钮 -->
      <view class="bottom-btns">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="tingeBtnStyle"
          @click="onBtnClick(false)"
          text="暂不同意"
        ></up-button>
        <up-button
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          @click="onBtnClick(true)"
          text="我已阅读并同意"
        ></up-button>
      </view>
    </view>
  </up-popup>
</template>

<script setup>
const isPopupShow = ref(false);

// 底部按钮样式
const tingeBtnStyle = {
  background: "#E3F0FF",
  width: "320rpx",
  height: "100rpx",
  margin: "0",
  color: "#4785EA",
  borderColor: "#E3F0FF",
};
const btnStyle = {
  background: "#4785EA",
  width: "320rpx",
  height: "100rpx",
  margin: "0",
};

const emit = defineEmits(["changeServiceAgree"]);

const onBtnClick = isAgree => {
  emit("changeServiceAgree", isAgree);
  isPopupShow.value = false;
};

// 打开编辑器
const openPayPopup = () => {
  isPopupShow.value = true;
};

// 关闭编辑器
const onPopupClose = () => {
  isPopupShow.value = false;
};

// 暴露方法给父组件
defineExpose({
  openPayPopup,
});
</script>
<style lang="scss" scoped>
.service-popup {
  padding: 24rpx 0 80rpx;
  @include flex-vhc;

  .cut-off {
    width: 700rpx;
    border-bottom: 1px solid #eeeeee;
    margin-top: 40rpx;
  }

  .service-content {
    width: 100vw;
    max-height: 62vh;

    .flex-vhc {
      width: 100%;
      @include flex-vhc;
      color: #333333;
    }

    .title {
      margin-top: 40rpx;
      width: 700rpx;
      font-size: 30rpx;
      font-weight: 600;
      margin-bottom: 30rpx;
    }

    .content {
      width: 700rpx;
      font-size: 28rpx;
      line-height: 2em;
      margin-bottom: 20rpx;
    }
  }

  .bottom-btns {
    width: 700rpx;
    padding-top: 24rpx;
    @include flex-hcb;
  }
}
</style>
