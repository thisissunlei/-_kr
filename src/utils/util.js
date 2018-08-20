const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const phone = n =>{
  let phoneTest = /^1[0-9]{10}$/;
  let value = phoneTest.test(n);
  return value;
}

const imgHttps = url => {
    let img = url.split(':')
    if ( img[0] === 'http' ) {
        img[0] = 'https'
    }
    return img.join(':')
}

module.exports = {
  formatTime: formatTime,
  phone:phone,
  imgHttps: imgHttps
}
