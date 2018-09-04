const app = getApp();
Page({
  data: {
    KrImgUrl: app.globalData.KrImgUrl,
    flag: false,
    manageList: [
      {
        img:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        name: "胡一天",
        tel: "18100000001",
        time: "2018-08-16 14:23:56",
        manage: false,
        checked: false
      },
      {
        img:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        name: "王俊凯",
        tel: "18100000001",
        time: "2018-08-16 14:23:56",
        manage: false,
        checked: false
      },
      {
        img:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        name: "蔡徐坤",
        time: "2018-08-16 14:23:56",
        manage: false,
        checked: false
      },
      {
        img:
          "https://wx.qlogo.cn/mmopen/vi_32/ibsL4hWribGEELUVvShThIb92ra1e5JEsg6TKsnQic4OrNTMZPic0QozC7dH2coXCo0BhK0wamhrkjnWT3PATqwokw/132",
        name: "易烊千玺",
        tel: "18100000001",
        time: "2018-08-16 14:23:56",
        manage: true,
        checked: false
      }
    ]
  },
  onLoad: function(options) {},
  //点击删除用卡人
  delPeople: function() {
    this.setData({
      flag: true
    });
  },
  //选择删除的用卡人
  checkedPeople: function(e) {
    console.log(e);
    var that = this;
    var arr = that.data.manageList;
    arr.map((value, key) => {
      //   console.log(value, key);
      value.checked = !value.checked;
      return value;
    });
    that.setData({
      manageList: arr
    });
    console.log(that.data.manageList);
  }
});
