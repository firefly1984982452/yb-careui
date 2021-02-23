function resizeHtml() {
  //首先取得当前窗口宽度
  /* var width = window.screen.width; */
  var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  var screenWidth = window.screen.width * window.devicePixelRatio;
	var scaleSize = 100,
    designSize = (screenWidth < 1080 ? 750 : 1080);
	//获得的宽度除以（设计尺寸除以缩放尺寸）
  var size = width / (designSize / scaleSize) * window.devicePixelRatio;
	//设置font-size
	document.getElementsByTagName('html')[0].style.fontSize = (size) + 'px';
}

export default function () {
  resizeHtml();
  window.addEventListener('resize', function () {
    resizeHtml();
  });
}