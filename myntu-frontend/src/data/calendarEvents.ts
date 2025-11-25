export type LocalizedText = {
  zh: string
  en: string
}

export type CalendarEvent = {
  date: string // YYYY-MM-DD
  title: LocalizedText
  dayoff?: boolean
}

// Example events. Replace or extend as needed.
export const calendarEvents: CalendarEvent[] = [
  // Example: 2025/09/21
  {
    date: '2025-09-05',
    title: { zh: '大三學生擬參加115學年度碩士班甄試排名提前畢業申請截止', en: 'Deadline for junior students applying for early graduation via participation in the 2026 Master’s Program admission ranking (Academic Year 115)' },
  },
  {
    date: '2025-09-06',
    title: { zh: '社團聯展', en: 'Student Club Fair' },
  },
  {
    date: '2025-09-06',
    title: { zh: '113學年度第二學期探索學分申請截止', en: 'Deadline for Exploratory Credit applications, 2nd semester of Academic Year 113' },
  },
  {
    date: '2025-09-13',
    title: { zh: '網路退選課程截止', en: 'Deadline for online course drop' },
  },
  {
    date: '2025-09-15',
    title: { zh: '網路加選課程截止', en: 'Deadline for online course add' },
  },
  {
    date: '2025-09-17',
    title: { zh: '網路確認選課結果開始(上午10時至9月19日截止)', en: 'Online confirmation of course selection begins (from 10:00 AM until September 19)' },
  },
  {
    date: '2025-09-17',
    title: { zh: '停修申請開始(至12月5日截止)', en: 'Start of course withdrawal applications (until December 5)' },
  },
  {
    date: '2025-09-22',
    title: { zh: '第一學期非學系申請服務學習開課（至10月17日）', en: 'Start of Service-Learning courses outside the department (until October 17)' },
  },
  {
    date: '2025-09-28',
    title: { zh: '教師節(放假日)', en: 'Teacher’s Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2025-09-29',
    title: { zh: '第一次進階英語網路申請免修開始(至10月3日截止，日期暫定以公告為準)', en: 'First round of online applications for Advanced English exemption begins (tentative deadline October 3, subject to official announcement)' },
  },
  {
    date: '2025-09-29',
    title: { zh: '教師節遇例假日補假', en: 'Substitute holiday for Teacher’s Day (when it coincides with a regular holiday)' },
    dayoff: true,
  },
  {
    date: '2025-10-06',
    title: { zh: '中秋節(放假日)', en: 'Mid-Autumn Festival (Holiday)' },
    dayoff: true,
  },
  {
    date: '2025-10-07',
    title: { zh: '第二階段學分費等各項費用繳費開始(至10月17日止)', en: 'Start of second phase tuition and miscellaneous fee payment (until October 17)' },
  },
  {
    date: '2025-10-10',
    title: { zh: '國慶日(放假日)', en: 'National Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2025-10-13',
    title: { zh: '休、退學學生退2/3學雜費截止', en: 'Deadline for 2/3 tuition refund for students who withdraw or take leave of absence' },
  },
  {
    date: '2025-10-13',
    title: { zh: '期中教學意見調查開始(至10月27日止)', en: 'Start of Midterm Teaching Feedback Survey (until October 27)' },
  },
  {
    date: '2025-10-17',
    title: { zh: '第一學期第一次教務會議', en: 'First Academic Affairs Meeting of the first semester' },
  },
  {
    date: '2025-10-18',
    title: { zh: '第一學期第一次校務會議', en: 'First University Affairs Meeting of the first semester' },
  },
  {
    date: '2025-10-18',
    title: { zh: '全校運動會游泳賽', en: 'University-wide Swimming Competition' },
  },
  {
    date: '2025-10-20',
    title: { zh: '期中考試開始(至10月24日止)，若教師另有訂定其他日期者，從其規定。', en: 'Midterm Examinations begin (until October 24; subject to instructors’ announced schedules if different)' },
  },
  {
    date: '2025-10-24',
    title: { zh: '臺灣光復暨金門古寧頭大捷紀念日遇例假日補假', en: 'Substitute holiday for Taiwan Restoration Day and Battle of Guningtou Victory Memorial Day (when coinciding with a regular holiday)' },
    dayoff: true,
  },
  {
    date: '2025-10-25',
    title: { zh: '臺灣光復暨金門古寧頭大捷紀念日(放假日)', en: 'Taiwan Restoration Day and Battle of Guningtou Victory Memorial Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2025-11-14',
    title: { zh: '休、退學學生退1/3學雜費截止', en: 'Deadline for 1/3 tuition refund for students who withdraw or take leave of absence' },
  },
  {
    date: '2025-11-15',
    title: { zh: '校慶園遊會', en: 'School Anniversary Fair' },
  },
  {
    date: '2025-11-15',
    title: { zh: '本校校慶(停課)', en: 'University Anniversary (No classes)' },
  },
  {
    date: '2025-11-21',
    title: { zh: '全校運動會(至11月22日止，停課不停班)', en: 'University-wide Sports Meet (until November 22; classes suspended, offices open)' },
  },
  {
    date: '2025-12-05',
    title: { zh: '停修申請截止(下午5時)', en: 'Deadline for course withdrawal applications (5:00 PM)' },
  },
  {
    date: '2025-12-12',
    title: { zh: '休學申請截止', en: 'Deadline for leave of absence applications' },
  },
  {
    date: '2025-12-12',
    title: { zh: '114學年度第一學期上課結束', en: 'End of classes for the 1st semester, Academic Year 114' },
  },
  {
    date: '2025-12-15',
    title: { zh: '期末考試開始(至12月19日止)，若教師另有訂定其他日期者，從其規定。', en: 'Final Examinations begin (until December 19; subject to instructors’ announced schedules if different)' },
  },
  {
    date: '2025-12-19',
    title: { zh: '第一學期第二次教務會議', en: 'Second Academic Affairs Meeting of the 1st semester' },
  },
  {
    date: '2025-12-20',
    title: { zh: '第一學期第二次校務會議', en: 'Second University Affairs Meeting of the 1st semester' },
  },
  {
    date: '2025-12-22',
    title: { zh: '受國定假日影響，週一課程得於本日補課', en: 'Make-up classes for Monday courses affected by national holidays' },
  },
  {
    date: '2025-12-22',
    title: { zh: '寒假開始(至115年2月20日止)', en: 'Winter Break begins (until February 20, Academic Year 115)' },
  },
  {
    date: '2025-12-23',
    title: { zh: '受國定假日影響，週五課程得於本日補課', en: 'Make-up classes for Friday courses affected by national holidays' },
  },
  {
    date: '2025-12-25',
    title: { zh: '行憲紀念日(放假日)', en: 'Constitution Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2025-12-25',
    title: { zh: '學士班第一學期應屆畢業生延長修業年限申請截止', en: 'Deadline for applications by graduating undergraduate students to extend study period (1st semester)' },
  },
  {
    date: '2025-12-25',
    title: { zh: '學士班第一學期應屆畢業生放棄修讀輔系、雙主修資格畢業申請截止', en: 'Deadline for graduating undergraduate students to withdraw from minor or double-major programs (1st semester)' },
  },
  {
    date: '2025-12-26',
    title: { zh: '受國定假日影響，週五課程得於本日補課', en: 'Make-up classes for Friday courses affected by national holidays' },
  },
  {
    date: '2025-12-29',
    title: { zh: '教師繳交學期成績截止日', en: 'Deadline for instructors to submit semester grades' },
  },
  {
    date: '2026-01-01',
    title: { zh: '元旦(放假日)', en: 'New Year’s Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-01-02',
    title: { zh: '公告114學年度第二學期全校課程', en: 'Announcement of university-wide courses for the 2nd semester, Academic Year 114' },
  },
  {
    date: '2026-01-19',
    title: { zh: '初選第一階開始(至1月21日截止)', en: 'First phase of preliminary course selection begins (until January 21)' },
  },
  {
    date: '2026-01-26',
    title: { zh: '初選第二階開始(至1月27日截止)', en: 'Second phase of preliminary course selection begins (until January 27)' },
  },
  {
    date: '2026-02-01',
    title: { zh: '115學年度碩士班入學筆試(至2月2日)', en: 'Written entrance examination for Master’s Program, Academic Year 115 (until February 2)' },
  },
  {
    date: '2026-02-02',
    title: { zh: '碩、博士班生學位考試完畢', en: 'Completion of Master’s and Doctoral degree examinations' },
  },
  {
    date: '2026-02-02',
    title: { zh: '第二學期繳交學雜費開始(至2月20日止)', en: 'Start of 2nd semester tuition and miscellaneous fee payment (until February 20)' },
  },
  {
    date: '2026-02-12',
    title: { zh: '調整放假(至2月13日止，公務人員、校聘人員及技工友由寒休抵扣2天)(暫定)', en: 'Adjusted holidays (until February 13; 2 days deducted from winter break for staff) (Tentative)' },
  },
  {
    date: '2026-02-15',
    title: { zh: '小年夜(放假日)', en: 'Lunar New Year’s Eve (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-02-16',
    title: { zh: '除夕(放假日)', en: 'Lunar New Year’s Eve (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-02-17',
    title: { zh: '年初一放假(春節開始，至2月19日止)', en: 'Lunar New Year Day (Spring Festival begins, until February 19)' },
    dayoff: true,
  },
  {
    date: '2026-02-18',
    title: { zh: '年初二放假', en: 'Lunar New Year – Second Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-02-19',
    title: { zh: '年初三放假', en: 'Lunar New Year – Third Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-02-20',
    title: { zh: '小年夜遇例假日補假', en: 'Substitute holiday for Lunar New Year’s Eve coinciding with a regular holiday' },
    dayoff: true,
  },
  {
    date: '2026-02-21',
    title: { zh: '國際學生迎新週(至2月22日止)', en: 'International Student Orientation Week (until February 22)' },
  },
  {
    date: '2026-02-22',
    title: { zh: '國際學生華語課程分班測驗', en: 'Placement Test for International Students’ Chinese Language Courses' },
  },
  {
    date: '2026-02-23',
    title: { zh: '第一學期碩、博士班學生學位論文繳交截止日', en: 'Deadline for submission of Master’s and Doctoral theses (1st semester)' },
  },
  {
    date: '2026-02-23',
    title: { zh: '第二學期碩、博士班生學位考試申請開始(至4月30日截止)', en: 'Start of Master’s and Doctoral degree examination applications for the 2nd semester (until April 30)' },
  },
  {
    date: '2026-02-23',
    title: { zh: '教師補交114學年第一學期成績截止', en: 'Deadline for instructors to submit grade corrections for 1st semester, Academic Year 114' },
  },
  {
    date: '2026-02-23',
    title: { zh: '補考開始(至2月24日止，限已核准期末考試請假者參加補考）', en: 'Start of make-up examinations (until February 24; for students with approved absences from final exams only)' },
  },
  {
    date: '2026-02-23',
    title: { zh: '網路加退選課程開始', en: 'Online course add/drop begins' },
  },
  {
    date: '2026-02-23',
    title: { zh: '114學年度第二學期上課開始', en: 'Start of classes for the 2nd semester, Academic Year 114' },
  },
  {
    date: '2026-02-27',
    title: { zh: '和平紀念日遇例假日補假', en: 'Substitute holiday for Peace Memorial Day coinciding with a regular holiday' },
    dayoff: true,
  },
  {
    date: '2026-02-28',
    title: { zh: '和平紀念日(放假日)', en: 'Peace Memorial Day (Holiday)' },
    dayoff: true,
  },
  {
    date: '2026-03-07',
    title: { zh: '校園徵才企業博覽會', en: 'Campus Recruitment Career Fair' },
  },
  {
    date: '2026-03-07',
    title: { zh: '網路退選課程截止', en: 'Deadline for online course drop' },
  },
  {
    date: '2026-03-09',
    title: { zh: '網路加選課程截止', en: 'Deadline for online course add' },
  },
  {
    date: '2026-03-11',
    title: { zh: '停修申請開始(至5月29日截止)', en: 'Start of course withdrawal applications (until May 29)' },
  },
  {
    date: '2026-03-11',
    title: { zh: '網路確認選課結果開始(上午10時至3月13日截止)', en: 'Online confirmation of course selection begins (from 10:00 AM until March 13)' },
  },
  {
    date: '2026-03-14',
    title: { zh: '社團博覽會', en: 'Student Club Expo' },
  },
  {
    date: '2026-03-14',
    title: { zh: '杜鵑花節開幕式', en: 'Azalea Festival Opening Ceremony' },
  },
  {
    date: '2026-03-14',
    title: { zh: '學系博覽會(至3月15日止)', en: 'Department Expo (until March 15)' },
  },
  {
    date: '2026-03-16',
    title: { zh: '第二學期非學系申請服務學習開課（至4月10日止）', en: 'Start of Service-Learning courses outside the department (until April 10)' },
  },
  {
    date: '2026-03-20',
    title: { zh: '第二學期第一次教務會議', en: 'First Academic Affairs Meeting of the 2nd semester' },
  },
  {
    date: '2026-03-21',
    title: { zh: '第二學期第一次校務會議', en: 'First University Affairs Meeting of the 2nd semester' },
  },
  {
    date: '2026-03-23',
    title: { zh: '第二次進階英語網路申請免修開始(至3月27日止，日期暫定以公告為準)', en: 'Second round of online applications for Advanced English exemption begins (tentative deadline March 27, subject to official announcement)' },
  },
  {
    date: '2026-03-28',
    title: { zh: '校園馬拉松賽', en: 'Campus Marathon' },
  },
  {
    date: '2026-03-30',
    title: { zh: '第二階段學分費等各項費用繳費開始(至4月10日止)', en: 'Start of second phase tuition and miscellaneous fee payment (until April 10)' },
  },
]


