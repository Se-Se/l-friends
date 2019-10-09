<template>
  <div class="calendar">
    <div class="calendar-tools">
      <span class="calendar-prev" @click="prev"></span>
      <span class="calendar-next" @click="next"></span>
      <div class="calendar-info">
        <div class="year">
          <input type="number" v-model="year" maxlength="4" @input="yearInput">
          <button class="btn-arr btn-prev" @click="yearNext"></button>
          <button class="btn-arr btn-next" @click="yearPrev"></button>
          <strong>{{ $t('calendar.year') }}</strong>
        </div>
        <div class="month">
          <input type="number" max="12" min="1" maxlength="2" minlength="1" :value="theMonth" @input="monthInput">
          <button class="btn-arr btn-prev" @click="next"></button>
          <button class="btn-arr btn-next" @click="prev"></button>
          <strong>{{ $t('calendar.month') }}</strong>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <table cellpadding="5">
        <thead>
          <tr>
            <td v-for="week in weeks" class="week" :key="week">{{week}}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day,k1) in days" style="{'animation-delay',(k1*30)+'ms'}" :key="k1">
            <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled}" @click="select(k1,k2,$event)" :key="k2">
              <span :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}" :style="child.disabled ? 'display: none;' : ''">{{child.day}}</span>
              <!-- <div class="text" v-if="child.eventName!=undefined">{{child.eventName}}</div>
              <div class="text" :class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}" v-if="lunar">{{child.lunar}}</div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import calendar from "./calendar.js"
export default {
  props: {
    // 多选模式
    multi: {
      type: Boolean,
      default: false
    },
    // 范围模式
    range: {
      type: Boolean,
      default: false
    },
    // 默认日期
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 开始选择日期
    begin: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 结束选择日期
    end: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否小于10补零
    zero: {
      type: Boolean,
      default: false
    },
    // 屏蔽的日期
    disabled: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否显示农历
    lunar: {
      type: Boolean,
      default: false
    },
    // 自定义星期名称
    weeks: {
      type: Array,
      default: function() {
        return ["일", "월", "화", "수", "목", "금", "토"]
      }
    },
    // 自定义月份
    months: {
      type: Array,
      default: function() {
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
      }
    },
    // 自定义事件
    events: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      years: [],
      yearsShow: false,
      year: 0,
      month: 0,
      day: 0,
      days: [],
      multiDays: [],
      today: [],
      festival: {
        lunar: {},
        gregorian: {}
      },
      rangeBegin: [],
      rangeEnd: []
    };
  },
  watch: {
    events() {
      this.render(this.year, this.month);
    },
    value() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    theMonth () {
      return this.month + 1
    }
  },
  methods: {
    init() {
      let now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      if (this.value.length > 0) {
        if (this.range) {
          //范围
          this.year = parseInt(this.value[0][0]);
          this.month = parseInt(this.value[0][1]) - 1;
          this.day = parseInt(this.value[0][2]);
          let year2 = parseInt(this.value[1][0]);
          let month2 = parseInt(this.value[1][1]) - 1;
          let day2 = parseInt(this.value[1][2]);
          this.rangeBegin = [this.year, this.month, this.day];
          this.rangeEnd = [year2, month2, day2];
        } else if (this.multi) {
          //多选
          this.multiDays = this.value;
          this.year = parseInt(this.value[0][0]);
          this.month = parseInt(this.value[0][1]) - 1;
          this.day = parseInt(this.value[0][2]);
        } else {
          //单选
          this.year = parseInt(this.value[0]);
          this.month = parseInt(this.value[1]) - 1;
          this.day = parseInt(this.value[2]);
        }
      }
      this.render(this.year, this.month);
    },
    // 渲染日期
    render(y, m) {
      let firstDayOfMonth = new Date(y, m, 1).getDay(); //当月第一天
      let lastDateOfMonth = new Date(y, m + 1, 0).getDate(); //当月最后一天
      let lastDayOfLastMonth = new Date(y, m, 0).getDate(); //最后一月的最后一天
      this.year = y;
      let seletSplit = this.value;
      let i,
        line = 0,
        temp = [],
        nextMonthPushDays = 1;
      for (i = 1; i <= lastDateOfMonth; i++) {
        let day = new Date(y, m, i).getDay(); //返回星期几（0～6）
        let k;
        // 第一行
        if (day == 0) {
          temp[line] = [];
        } else if (i == 1) {
          temp[line] = [];
          k = lastDayOfLastMonth - firstDayOfMonth + 1;
          for (let j = 0; j < firstDayOfMonth; j++) {
            // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
            temp[line].push(
              Object.assign(
                { day: k, disabled: true },
                this.getLunarInfo(
                  this.computedPrevYear(),
                  this.computedPrevMonth(true),
                  k
                ),
                this.getEvents(
                  this.computedPrevYear(),
                  this.computedPrevMonth(true),
                  k
                )
              )
            );
            k++;
          }
        }

        if (this.range) {
          // 范围
          // console.log("日期范围",this.getLunarInfo(this.year,this.month+1,i))
          let options = Object.assign(
            { day: i },
            this.getLunarInfo(this.year, this.month + 1, i),
            this.getEvents(this.year, this.month + 1, i)
          );
          if (this.rangeBegin.length > 0) {
            let beginTime = Number(
              new Date(
                this.rangeBegin[0],
                this.rangeBegin[1],
                this.rangeBegin[2]
              )
            );
            let endTime = Number(
              new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2])
            );
            let stepTime = Number(new Date(this.year, this.month, i));
            if (beginTime <= stepTime && endTime >= stepTime) {
              options.selected = true;
            }
          }
          if (this.begin.length > 0) {
            let beginTime = Number(
              new Date(
                parseInt(this.begin[0]),
                parseInt(this.begin[1]) - 1,
                parseInt(this.begin[2])
              )
            );
            if (beginTime > Number(new Date(this.year, this.month, i)))
              options.disabled = true;
          }
          if (this.end.length > 0) {
            let endTime = Number(
              new Date(
                parseInt(this.end[0]),
                parseInt(this.end[1]) - 1,
                parseInt(this.end[2])
              )
            );
            if (endTime < Number(new Date(this.year, this.month, i)))
              options.disabled = true;
          }
          if (this.disabled.length > 0) {
            if (
              this.disabled.filter(v => {
                return (
                  this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                );
              }).length > 0
            ) {
              options.disabled = true;
            }
          }
          temp[line].push(options);
        } else if (this.multi) {
          //多选
          let options;
          // 判断是否选中
          if (
            this.value.filter(v => {
              return (
                this.year === v[0] && this.month === v[1] - 1 && i === v[2]
              );
            }).length > 0
          ) {
            options = Object.assign(
              { day: i, selected: true },
              this.getLunarInfo(this.year, this.month + 1, i),
              this.getEvents(this.year, this.month + 1, i)
            );
          } else {
            options = Object.assign(
              { day: i, selected: false },
              this.getLunarInfo(this.year, this.month + 1, i),
              this.getEvents(this.year, this.month + 1, i)
            );
            if (this.begin.length > 0) {
              let beginTime = Number(
                new Date(
                  parseInt(this.begin[0]),
                  parseInt(this.begin[1]) - 1,
                  parseInt(this.begin[2])
                )
              );
              if (beginTime > Number(new Date(this.year, this.month, i)))
                options.disabled = true;
            }
            if (this.end.length > 0) {
              let endTime = Number(
                new Date(
                  parseInt(this.end[0]),
                  parseInt(this.end[1]) - 1,
                  parseInt(this.end[2])
                )
              );
              if (endTime < Number(new Date(this.year, this.month, i)))
                options.disabled = true;
            }
            if (this.disabled.length > 0) {
              if (
                this.disabled.filter(v => {
                  return (
                    this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                  );
                }).length > 0
              ) {
                options.disabled = true;
              }
            }
          }

          temp[line].push(options);
        } else {
          // 单选
          // console.log(this.lunar(this.year,this.month,i));

          let chk = new Date();
          let chkY = chk.getFullYear();
          let chkM = chk.getMonth();
          // 匹配上次选中的日期
          if (
            parseInt(seletSplit[0]) == this.year &&
            parseInt(seletSplit[1]) - 1 == this.month &&
            parseInt(seletSplit[2]) == i
          ) {
            // console.log("匹配上次选中的日期",lunarYear,lunarMonth,lunarValue,lunarInfo)
            temp[line].push(
              Object.assign(
                { day: i, selected: true },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              )
            );
            this.today = [line, temp[line].length - 1];
          }
          // 没有默认值的时候显示选中今天日期
          else if (
            chkY == this.year &&
            chkM == this.month &&
            i == this.day &&
            this.value == ""
          ) {
            // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
            temp[line].push(
              Object.assign(
                { day: i, selected: true },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              )
            );
            this.today = [line, temp[line].length - 1];
          } else {
            // 普通日期
            // console.log("设置可选范围",i,lunarYear,lunarMonth,lunarValue,lunarInfo)
            let options = Object.assign(
              { day: i, selected: false },
              this.getLunarInfo(this.year, this.month + 1, i),
              this.getEvents(this.year, this.month + 1, i)
            );
            if (this.begin.length > 0) {
              let beginTime = Number(
                new Date(
                  parseInt(this.begin[0]),
                  parseInt(this.begin[1]) - 1,
                  parseInt(this.begin[2])
                )
              );
              if (beginTime > Number(new Date(this.year, this.month, i)))
                options.disabled = true;
            }
            if (this.end.length > 0) {
              let endTime = Number(
                new Date(
                  parseInt(this.end[0]),
                  parseInt(this.end[1]) - 1,
                  parseInt(this.end[2])
                )
              );
              if (endTime < Number(new Date(this.year, this.month, i)))
                options.disabled = true;
            }
            if (this.disabled.length > 0) {
              if (
                this.disabled.filter(v => {
                  return (
                    this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                  );
                }).length > 0
              ) {
                options.disabled = true;
              }
            }
            temp[line].push(options);
          }
        }
        // 到周六换行
        if (day == 6 && i < lastDateOfMonth) {
          line++;
        } else if (i == lastDateOfMonth) {
          // line++
          let k = 1;
          for (let d = day; d < 6; d++) {
            // console.log(this.computedNextYear()+"-"+this.computedNextMonth(true)+"-"+k)
            temp[line].push(
              Object.assign(
                { day: k, disabled: true },
                this.getLunarInfo(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  k
                ),
                this.getEvents(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  k
                )
              )
            );
            k++;
          }
          // 下个月除了补充的前几天开始的日期
          nextMonthPushDays = k;
        }
      } //end for
      this.days = temp;
    },
    computedPrevYear() {
      let value = this.year;
      if (this.month < 0) {
        value--;
      }
      // if (this.month - 1 < 0) {
      //   value--;
      // }
      return value;
    },
    computedPrevMonth(isString) {
      let value = this.month;
      if (this.month < 0) {
        value = 11;
      } else {
        value--;
      }
      // if (this.month - 1 < 0) {
      //   value = 11;
      // } else {
      //   value--;
      // }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1;
      }
      return value;
    },
    computedNextYear() {
      let value = this.year;
      if (this.month > 11) {
        value++;
      }
      // if (this.month + 1 > 11) {
      //   value++;
      // }
      return value;
    },
    computedNextMonth(isString) {
      let value = this.month;
      if (this.month > 11) {
        value = 1;
      } else {
        value++;
      }
      // if (this.month + 1 > 11) {
      //   value = 0;
      // } else {
      //   value++;
      // }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1;
      }
      return value;
    },
    // 获取农历信息
    getLunarInfo(y, m, d) {
      let lunarInfo = calendar.solar2lunar(y, m, d);
      let lunarValue = lunarInfo.IDayCn;
      // console.log(lunarInfo)
      let isLunarFestival = false;
      let isGregorianFestival = false;
      if (
        this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] !=
        undefined
      ) {
        lunarValue = this.festival.lunar[
          lunarInfo.lMonth + "-" + lunarInfo.lDay
        ];
        isLunarFestival = true;
      } else if (this.festival.gregorian[m + "-" + d] != undefined) {
        lunarValue = this.festival.gregorian[m + "-" + d];
        isGregorianFestival = true;
      }
      return {
        lunar: lunarValue,
        isLunarFestival: isLunarFestival,
        isGregorianFestival: isGregorianFestival
      };
    },
    // 获取自定义事件
    getEvents(y, m, d) {
      if (Object.keys(this.events).length == 0) return false;
      let eventName = this.events[y + "-" + m + "-" + d];
      let data = {};
      if (eventName != undefined) {
        data.eventName = eventName;
      }
      return data;
    },
    // 上月
    prev(e) {
      e.stopPropagation();
      // if (this.month == 0) {
      //   this.month = 11;
      //   this.year = parseInt(this.year) - 1;
      // } else {
      //   this.month = parseInt(this.month) - 1;
      // }
      // this.render(this.year, this.month);
      // this.$emit("selectMonth", this.month + 1, this.year);
      // this.$emit("prev", this.month + 1, this.year);
      if (this.month == 0) {
        this.month = 11;
        this.year = parseInt(this.year) - 1;
      } else {
        this.month = parseInt(this.month) - 1;
      }
      this.render(this.year, this.month);
      this.$emit("selectMonth", this.month, this.year);
      this.$emit("prev", this.month, this.year);
    },
    //  下月
    next(e) {
      e.stopPropagation();
      // if (this.month == 11) {
      //   this.month = 0;
      //   this.year = parseInt(this.year) + 1;
      // } else {
      //   this.month = parseInt(this.month) + 1;
      // }
      // this.render(this.year, this.month);
      // this.$emit("selectMonth", this.month + 1, this.year);
      // this.$emit("next", this.month + 1, this.year);
      if (this.month == 11) {
        this.month = 0;
        this.year = parseInt(this.year) + 1;
      } else {
        this.month = parseInt(this.month) + 1;
      }
      this.render(this.year, this.month);
      this.$emit("selectMonth", this.month, this.year);
      this.$emit("next", this.month, this.year);
    },
    // 选中日期
    select(k1, k2, e) {
      if (e != undefined) e.stopPropagation();
      // 日期范围
      if (this.range) {
        if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
          this.rangeBegin = [this.year, this.month, this.days[k1][k2].day];
          this.rangeBeginTemp = this.rangeBegin;
          this.rangeEnd = [this.year, this.month, this.days[k1][k2].day];
          this.rangeEndTemp = 0;
        } else {
          this.rangeEnd = [this.year, this.month, this.days[k1][k2].day];
          this.rangeEndTemp = 1;
          // 判断结束日期小于开始日期则自动颠倒过来
          if (
            +new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) <
            +new Date(
              this.rangeBegin[0],
              this.rangeBegin[1],
              this.rangeBegin[2]
            )
          ) {
            this.rangeBegin = this.rangeEnd;
            this.rangeEnd = this.rangeBeginTemp;
          }
          // 小于10左边打补丁
          let begin = [];
          let end = [];
          if (this.zero) {
            this.rangeBegin.forEach((v, k) => {
              if (k == 1) v = v + 1;
              begin.push(this.zeroPad(v));
            });
            this.rangeEnd.forEach((v, k) => {
              if (k == 1) v = v + 1;
              end.push(this.zeroPad(v));
            });
          } else {
            begin = this.rangeBegin;
            end = this.rangeEnd;
          }
          // console.log("选中日期",begin,end)
          this.$emit("select", begin, end);
        }
        this.render(this.year, this.month);
      } else if (this.multi) {
        // 如果已经选过则过滤掉
        let filterDay = this.multiDays.filter(v => {
          return (
            this.year === v[0] &&
            this.month === v[1] - 1 &&
            this.days[k1][k2].day === v[2]
          );
        });
        if (filterDay.length > 0) {
          this.multiDays = this.multiDays.filter(v => {
            return (
              this.year !== v[0] ||
              this.month !== v[1] - 1 ||
              this.days[k1][k2].day !== v[2]
            );
          });
        } else {
          this.multiDays.push([
            this.year,
            this.month + 1,
            this.days[k1][k2].day
          ]);
        }
        this.days[k1][k2].selected = !this.days[k1][k2].selected;
        this.$emit("select", this.multiDays);
      } else {
        // 取消上次选中
        if (this.today.length > 0) {
          this.days.forEach(v => {
            v.forEach(vv => {
              vv.selected = false;
            });
          });
        }
        // 设置当前选中天
        this.days[k1][k2].selected = true;
        this.day = this.days[k1][k2].day;
        this.today = [k1, k2];
        this.$emit("select", [
          this.year,
          // this.zero ? this.zeroPad(this.month) : this.month,
          this.zero ? this.zeroPad(this.month + 1) : this.month + 1,
          this.zero
            ? this.zeroPad(this.days[k1][k2].day)
            : this.days[k1][k2].day
        ]);
      }
    },
    changeYear() {
      if (this.yearsShow) {
        this.yearsShow = false;
        return false;
      }
      this.yearsShow = true;
      this.years = [];
      for (let i = ~~this.year - 10; i < ~~this.year + 10; i++) {
        this.years.push(i);
      }
    },
    yearInput (value) {
      let theValue = value.target.value
      if (theValue.length === 4) {
        this.selectYear(theValue)
      }
    },
    monthInput (value) {
      let nowMonth = value.target.value
      if (nowMonth.length >= 1 && nowMonth.length <= 2 && nowMonth >= 1 && nowMonth <= 12) {
        if (nowMonth > this.theMonth) {
          this.next(value)
        } else if (nowMonth < this.theMonth){
          this.prev(value)
        }
        this.month = nowMonth - 1
      }
      
    },
    yearChange (value) {
      let theYear = value.target.value
      if (theYear.length == 4) {
        this.selectYear(value.target.value)
      }
    },
    yearPrev () {
      this.year -= 1
      this.selectYear(this.year)
    },
    yearNext () {
      this.year += 1
      this.selectYear(this.year)
    },
    selectYear(value) {
      this.yearsShow = false;
      this.year = value;
      this.render(this.year, this.month);
      this.$emit("selectYear", value);
    },
    // 返回今天
    setToday() {
      let now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      this.render(this.year, this.month);
      // 遍历当前日找到选中
      this.days.forEach(v => {
        let day = v.find(vv => {
          return vv.day == this.day && !vv.disabled;
        });
        if (day != undefined) {
          day.selected = true;
        }
      });
    },
    // 日期补零
    zeroPad(n) {
      return String(n < 10 ? "0" + n : n);
    }
  }
};
</script>