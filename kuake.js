/**
 * 打开控制台，下载视频，记录以下参数
 */
var pwd_id = 'b89863b3ed3d';//
var stoken = '425SmkIW0frUBGHjhzK1wiFaTo4el4SVddQHtNNKjY4=';
var pdir_fid = '48732a9147e94bd68520dcc0caa40c96';//下载目录
var to_pdir_fid = '0bef6850c5bd488f8ca076134603734c';//下载到目录
let page = 65;//总页数
var list = [];
for (let i = 1; i <= page; i++) {
  let t = Date.now();
  fetch("https://drive-h.quark.cn/1/clouddrive/share/sharepage/detail?pr=ucpro&fr=pc&uc_param_str=&pwd_id=" + pwd_id + "&stoken=" + encodeURIComponent(stoken) + "&pdir_fid=" + pdir_fid + "&force=0&_page=" + i +"&_size=50&_fetch_banner=0&_fetch_share=0&_fetch_total=1&_sort=file_type:asc,updated_at:desc&__dt=0&__t=" + t, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://pan.quark.cn/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.json()).then(res => {
      list.push(...res.data.list)
  });
}


function sleep(time){
 return new Promise((resolve) => setTimeout(resolve, time));
}

let total = list.length
for (var i = 0; i < total; i++) {
  console.log(i + '/' + total)
  let it = list[i];
let t = Date.now();
let save = await fetch("https://drive-pc.quark.cn/1/clouddrive/share/sharepage/save?pr=ucpro&fr=pc&uc_param_str=&__dt=0&__t=" + t, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://pan.quark.cn/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"fid_list\":[\"" + it['fid'] + "\"],\"fid_token_list\":[\"" + it.share_fid_token + "\"],\"to_pdir_fid\":\"" + to_pdir_fid + "\",\"pwd_id\":\"" + pwd_id + "\",\"stoken\":\"" + stoken + "\",\"pdir_fid\":\"0\",\"scene\":\"link\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(res => res.json());


let task_id = save.data.task_id;
let fid
for (let ii = 0; ii < 3; i++) {
  await sleep(1000)
  let task = await fetch("https://drive-pc.quark.cn/1/clouddrive/task?pr=ucpro&fr=pc&uc_param_str=&task_id=" + task_id + "&retry_index=" + ii + "&__dt=0&__t=" + t, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://pan.quark.cn/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.json());
  if (task.data.save_as.save_as_top_fids[0]) {
    fid = task.data.save_as.save_as_top_fids[0]
    break;
  }
}
if (!fid) {
  continue;
}
// let to_pdir_fid = task.data.save_as.to_pdir_fid

await sleep(1000)
let down = await fetch("https://drive-pc.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&uc_param_str=&__dt=0&__t=" + t, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json;charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://pan.quark.cn/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"fids\":[\"" + fid + "\"]}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(res=>res.json());
let url = down.data[0].download_url;

open(url)
}



        return window.performance && window.performance.timing ? Date.now() - window.performance.timing.navigationStart : 0
