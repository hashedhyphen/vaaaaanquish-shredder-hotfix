// slider
var elem = document.getElementById("range");
var target = document.getElementById("value");
var rangeValue = function(elem, target) {
  return function(evt) {
    target.innerHTML = elem.value;
  };
};
elem.addEventListener("input", rangeValue(elem, target));
// slider
var elemw = document.getElementById("rangew");
var targetw = document.getElementById("valuew");
var rangeValuew = function(elemw, targetw) {
  return function(evt) {
    targetw.innerHTML = elemw.value;
  };
};
elemw.addEventListener("input", rangeValuew(elemw, targetw));

// shredder
var cs = document.getElementById("myCanvas");
var cs2 = document.createElement("canvas");
var ctx = cs.getContext("2d");
var ctx2 = cs2.getContext("2d");
// size
var x = 0;
var sp = 10;
var N = 1;
var canvas_size_w = 364;
var canvas_size_h = 527;
var side_margin = 10;
var bottom_margin = 115;
cs.width = 364 + side_margin * 2;
cs.height = 535 * 2 + bottom_margin;
ctx.clearRect(0, 0, cs.width, cs.height);
// render
var refreshIntervalId;
var image = new Image();
image.crossOrigin = "Anonymous";
function rend() {
  /* buffer */
  ctx2.clearRect(0, 0, cs2.width, cs2.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas_size_w, canvas_size_h);
  ctx2.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    side_margin,
    x * (canvas_size_h / image.height),
    canvas_size_w,
    canvas_size_h
  );
  /* frame */
  ctx2.clearRect(0, canvas_size_h, cs2.width, cs2.height);

  var num_lines = cs.width / sp;
  var line_width_in_src = image.width / num_lines;

  for (var j = 0; (j + 1) * line_width_in_src < image.width; j++) {
    ctx2.drawImage(
      image,
      j * line_width_in_src, // sx
      0, // sy
      line_width_in_src, // sWidth
      image.height, // sHeight
      j * sp + j, // dx
      canvas_size_h + bottom_margin, // dy
      sp, // dWidth
      x * (canvas_size_h / image.height) // dHeight
    );
    // ctx2.drawImage(
    //   image,
    //   j * sp * (image.width / canvas_size_w),
    //   image.height - x + bottom_margin,
    //   sp,
    //   x,
    //   j * sp + j,
    //   canvas_size_h + bottom_margin,
    //   sp,
    //   x * (canvas_size_h / image.height)
    // );
  }
  /* output */
  imageData = ctx2.getImageData(0, 0, cs2.width, cs2.height);
  ctx.putImageData(imageData, 0, 0);
  if (x > image.height * N + bottom_margin) {
    clearInterval(refreshIntervalId);
  } else {
    x += 1;
  }
}
// image form
var file = document.getElementById("file");
function loadLocalImage(e) {
  var fileData = e.target.files[0];
  if (!fileData.type.match("image.*")) {
    alert("Please select image!");
    return;
  }
  var reader = new FileReader();
  function setCtx(callback) {
    image.src = reader.result;
    cs.width = canvas_size_w + side_margin * 2;
    cs2.width = canvas_size_w + side_margin * 2;
    cs.height = canvas_size_h * 2 + bottom_margin;
    cs2.height = canvas_size_h * 2 + bottom_margin;
    x = 0;
    clearInterval(refreshIntervalId);
    setTimeout(function() {
      callback();
    }, 500);
    return rend;
  }
  reader.onload = function() {
    setCtx(rend);
  };
  reader.readAsDataURL(fileData);
}
file.addEventListener("change", loadLocalImage, false);
// submit
var sub = document.getElementById("submit");
function submitForm() {
  x = 0;
  N = document.getElementById("range").value / 100;
  sp = document.getElementById("rangew").value;
  refreshIntervalId = setInterval(rend, 50);
}
sub.addEventListener("click", submitForm, false);
