/**
 * Demo explore grid data — replace with API in production.
 * Loaded before plan-b-verify.js; exposed for static file:// demos without a bundler.
 */
window.PlanBDemo = window.PlanBDemo || {};
window.PlanBDemo.assetPaths = [
  "assets/Snipaste_2026-03-12_21-07-16.jpg",
  "assets/card2.jpg",
  "assets/card3.jpg",
  "assets/card4.jpg"
];
window.PlanBDemo.libraryData = {
  moves: {
    title: "推荐动作",
    recommended: [
      ["壶铃深蹲", "下肢力量与稳定性", "中级"],
      ["爆发划船", "背部与核心链条", "初级–中级"],
      ["肩上推举", "上肢推的控制", "中级–高级"],
      ["普拉提核心流动", "核心稳定与呼吸", "初级"],
      ["战绳燃脂", "耐力与爆发循环", "中级–高级"],
      ["硬拉基础", "后链专项", "中级"]
    ],
    latest: [
      ["单臂划船", "单侧稳定与发力", "最新"],
      ["臀桥", "臀部激活与控制", "初级"],
      ["胸部推举", "上肢推与节奏", "中级"],
      ["侧平板抬升", "侧链稳定", "初级–中级"],
      ["高脚杯箭步蹲", "步态与平衡控制", "中级"],
      ["呼吸重置", "呼吸与恢复", "初级"]
    ]
  },
  courses: {
    title: "推荐课程",
    recommended: [
      ["力量入门", "全身力量入门", "6 次训练"],
      ["普拉提重置", "核心与呼吸重置", "8 次训练"],
      ["上肢力量模块", "上肢专项", "5 次训练"],
      ["腿部专项营", "下肢训练营", "7 次训练"],
      ["有氧塑形", "有氧与塑形", "9 次训练"],
      ["核心稳定实验室", "核心稳定实验室", "6 次训练"]
    ],
    latest: [
      ["混合燃脂", "力量与有氧结合", "10 次训练"],
      ["运动体态", "体态与控制", "6 次训练"],
      ["爆发下肢", "下肢爆发力", "5 次训练"],
      ["核心呼吸同步", "核心与呼吸同步", "4 次训练"],
      ["节奏力量", "节奏力量", "7 次训练"],
      ["周末重置", "周末恢复", "3 次训练"]
    ]
  },
  plans: {
    title: "推荐计划",
    recommended: [
      ["第1周构建", "7 天初学者构建", "7 天"],
      ["核心优先计划", "核心优先周期", "14 天"],
      ["精瘦力量 21", "21 天精瘦力量", "21 天"],
      ["普拉提习惯", "普拉提习惯", "14 天"],
      ["力量进阶", "力量进阶", "28 天"],
      ["久坐重置", "久坐重置计划", "7 天"]
    ],
    personalized: [
      ["春季减脂计划", "春季减脂计划", "30 天"],
      ["入门一周", "一周入门", "7 天"],
      ["轻核心康复", "轻度核心康复", "10 天"],
      ["推拉分化", "推拉循环", "21 天"],
      ["每日普拉提", "每日普拉提", "14 天"],
      ["周末运动者", "周末运动者", "8 天"]
    ],
    latest: [
      ["春季减脂计划", "春季减脂计划", "30 天"],
      ["入门一周", "一周入门", "7 天"],
      ["轻核心康复", "轻度核心康复", "10 天"],
      ["推拉分化", "推拉循环", "21 天"],
      ["每日普拉提", "每日普拉提", "14 天"],
      ["周末运动者", "周末运动者", "8 天"]
    ]
  },
  allTraining: {
    moves: [
      {
        id: "move-kettlebell-squat",
        name: "壶铃深蹲",
        summary: "下肢力量与支撑控制。",
        scene: "Strength Training",
        equipment: "Handle",
        targetArea: "Legs",
        difficulty: "Intermediate",
        supportsAi: true
      },
      {
        id: "move-power-row",
        name: "爆发划船",
        summary: "背部链条发力，核心稳定。",
        scene: "Strength Training",
        equipment: "Dual Cable",
        targetArea: "Back",
        difficulty: "Beginner",
        supportsAi: true
      },
      {
        id: "move-shoulder-press",
        name: "肩上推举",
        summary: "过头推举，提升上肢力量。",
        scene: "Strength Training",
        equipment: "Barbell",
        targetArea: "Shoulders",
        difficulty: "Advanced",
        supportsAi: false
      },
      {
        id: "move-pilates-core-flow",
        name: "普拉提核心流动",
        summary: "以呼吸引导的深层核心激活流动。",
        scene: "Pilates",
        equipment: "Bodyweight",
        targetArea: "Full Body",
        difficulty: "Beginner",
        supportsAi: true
      },
      {
        id: "move-battle-rope-burn",
        name: "战绳燃脂",
        summary: "快速间歇提升有氧耐力。",
        scene: "Cardio Fat Burn",
        equipment: "Dual Cable",
        targetArea: "Upper Limbs",
        difficulty: "Advanced",
        supportsAi: false
      },
      {
        id: "move-deadlift-basics",
        name: "硬拉基础",
        summary: "后链发力机制与节奏控制。",
        scene: "Strength Training",
        equipment: "Barbell",
        targetArea: "Back",
        difficulty: "Intermediate",
        supportsAi: true
      },
      {
        id: "move-glute-bridge",
        name: "臀桥",
        summary: "髋伸展与臀部激活练习。",
        scene: "Stretch Recovery",
        equipment: "Bodyweight",
        targetArea: "Glutes",
        difficulty: "Beginner",
        supportsAi: false
      },
      {
        id: "move-side-plank-lift",
        name: "侧平板抬升",
        summary: "强化肩部与核心的侧链稳定。",
        scene: "Pilates",
        equipment: "Bodyweight",
        targetArea: "Shoulders",
        difficulty: "Intermediate",
        supportsAi: true
      },
      {
        id: "move-goblet-lunge",
        name: "高脚杯箭步蹲",
        summary: "单腿控制与体态训练。",
        scene: "Strength Training",
        equipment: "Handle",
        targetArea: "Legs",
        difficulty: "Intermediate",
        supportsAi: true
      },
      {
        id: "move-breath-reset",
        name: "呼吸重置",
        summary: "舒缓的呼吸序列，帮助恢复。",
        scene: "Stretch Recovery",
        equipment: "Bodyweight",
        targetArea: "Full Body",
        difficulty: "Beginner",
        supportsAi: false
      }
    ],
    aiMoves: [
      {
        id: "ai-smart-squat-coach",
        name: "智能深蹲教练",
        summary: "针对深度、髋部偏移与节奏的 AI 反馈。",
        scene: "Strength Training",
        equipment: "Barbell",
        targetArea: "Legs",
        difficulty: "Intermediate"
      },
      {
        id: "ai-form-row-guide",
        name: "划船姿态指导",
        summary: "AI 指导拉的轨迹与肩部对齐。",
        scene: "Strength Training",
        equipment: "Dual Cable",
        targetArea: "Back",
        difficulty: "Beginner"
      },
      {
        id: "ai-pilates-breath-sync",
        name: "普拉提呼吸同步",
        summary: "呼吸节奏指导，配合核心提示。",
        scene: "Pilates",
        equipment: "Bodyweight",
        targetArea: "Full Body",
        difficulty: "Beginner"
      },
      {
        id: "ai-lunge-balance-assist",
        name: "箭步蹲平衡辅助",
        summary: "AI 帮助保持骨盆稳定与膝盖轨迹。",
        scene: "Strength Training",
        equipment: "Handle",
        targetArea: "Legs",
        difficulty: "Intermediate"
      },
      {
        id: "ai-cardio-pulse-trainer",
        name: "有氧心率训练",
        summary: "燃脂间歇的配速与强度提示。",
        scene: "Cardio Fat Burn",
        equipment: "Dual Cable",
        targetArea: "Full Body",
        difficulty: "Advanced"
      },
      {
        id: "ai-posture-reset",
        name: "体态重置教练",
        summary: "针对颈部与上背的实时纠正。",
        scene: "Stretch Recovery",
        equipment: "Bodyweight",
        targetArea: "Upper Limbs",
        difficulty: "Beginner"
      },
      {
        id: "ai-shoulder-control-lab",
        name: "肩部控制实验室",
        summary: "肩胛时序分析，让推举更安全。",
        scene: "Strength Training",
        equipment: "Handle",
        targetArea: "Shoulders",
        difficulty: "Advanced"
      },
      {
        id: "ai-glute-drive-monitor",
        name: "臀部发力监测",
        summary: "臀桥动作的髋部发力质量评分。",
        scene: "Stretch Recovery",
        equipment: "Bodyweight",
        targetArea: "Glutes",
        difficulty: "Intermediate"
      }
    ],
    plans: [
      {
        id: "plan-strength-2w-3x",
        name: "力量启蒙 2周",
        summary: "两周内打好全身力量基础。",
        scene: "Strength Training",
        cycleWeeks: "2 Weeks",
        sessionsPerWeek: "3 Sessions",
        targetArea: "Full Body",
        difficulty: "Beginner"
      },
      {
        id: "plan-lean-lower-3w-4x",
        name: "精瘦下肢塑造",
        summary: "专注下肢的进阶训练周期。",
        scene: "Strength Training",
        cycleWeeks: "3 Weeks",
        sessionsPerWeek: "4 Sessions",
        targetArea: "Legs",
        difficulty: "Intermediate",
        isPersonalized: true
      },
      {
        id: "plan-pilates-core-4w-5x",
        name: "普拉提核心习惯",
        summary: "每日核心稳定与呼吸练习。",
        scene: "Pilates",
        cycleWeeks: "4 Weeks",
        sessionsPerWeek: "5 Sessions",
        targetArea: "Full Body",
        difficulty: "Beginner"
      },
      {
        id: "plan-back-posture-2w-4x",
        name: "背部体态重置",
        summary: "恢复上背体态与耐力。",
        scene: "Stretch Recovery",
        cycleWeeks: "2 Weeks",
        sessionsPerWeek: "4 Sessions",
        targetArea: "Back",
        difficulty: "Beginner"
      },
      {
        id: "plan-shoulder-power-3w-5x",
        name: "肩部力量模块",
        summary: "提升过头能力与控制。",
        scene: "Strength Training",
        cycleWeeks: "3 Weeks",
        sessionsPerWeek: "5 Sessions",
        targetArea: "Shoulders",
        difficulty: "Advanced"
      },
      {
        id: "plan-cardio-burn-4w-4x",
        name: "有氧燃脂构建",
        summary: "渐进式有氧训练，助力燃脂。",
        scene: "Cardio Fat Burn",
        cycleWeeks: "4 Weeks",
        sessionsPerWeek: "4 Sessions",
        targetArea: "Full Body",
        difficulty: "Intermediate",
        isPersonalized: true
      },
      {
        id: "plan-upper-control-2w-3x",
        name: "上肢控制基础",
        summary: "上肢动作模式与体态节奏。",
        scene: "Pilates",
        cycleWeeks: "2 Weeks",
        sessionsPerWeek: "3 Sessions",
        targetArea: "Upper Limbs",
        difficulty: "Beginner",
        isPersonalized: true
      },
      {
        id: "plan-glute-activation-3w-3x",
        name: "臀部激活周期",
        summary: "髋部稳定与臀部耐力专项。",
        scene: "Stretch Recovery",
        cycleWeeks: "3 Weeks",
        sessionsPerWeek: "3 Sessions",
        targetArea: "Glutes",
        difficulty: "Intermediate"
      }
    ],
    planDetails: {
      "plan-strength-2w-3x": {
        id: "plan-strength-2w-3x",
        name: "力量启蒙 2周",
        intro: "为期两周的入门计划，通过干净的动作模式与稳定的训练量，帮助你建立全身训练习惯。",
        scene: "Strength Training",
        cycleWeeks: "2 Weeks",
        sessionsPerWeek: "3 Sessions",
        difficulty: "Beginner",
        cover: "assets/card3.jpg",
        schedule: [
          {
            week: 1,
            days: [
              {
                day: 1,
                moves: [
                  { name: "壶铃深蹲", sets: 3, repsOrDuration: "12 次", restSeconds: 45, weightKg: 16 },
                  { name: "爆发划船", sets: 3, repsOrDuration: "10 次", restSeconds: 45, weightKg: 18 },
                  { name: "呼吸重置", sets: 2, repsOrDuration: "40 秒", restSeconds: 20 }
                ]
              },
              {
                day: 2,
                moves: [
                  { name: "高脚杯箭步蹲", sets: 3, repsOrDuration: "10 次/侧", restSeconds: 50, weightKg: 14 },
                  { name: "肩上推举", sets: 3, repsOrDuration: "8 次", restSeconds: 60, weightKg: 12 },
                  { name: "臀桥", sets: 3, repsOrDuration: "14 次", restSeconds: 40 }
                ]
              },
              {
                day: 3,
                moves: [
                  { name: "硬拉基础", sets: 4, repsOrDuration: "8 次", restSeconds: 65, weightKg: 20 },
                  { name: "爆发划船", sets: 3, repsOrDuration: "12 次", restSeconds: 45, weightKg: 16 },
                  { name: "侧平板抬升", sets: 2, repsOrDuration: "35 秒/侧", restSeconds: 25 }
                ]
              }
            ]
          },
          {
            week: 2,
            days: [
              {
                day: 1,
                moves: [
                  { name: "壶铃深蹲", sets: 4, repsOrDuration: "10 次", restSeconds: 50, weightKg: 18 },
                  { name: "肩上推举", sets: 3, repsOrDuration: "10 次", restSeconds: 55, weightKg: 14 },
                  { name: "呼吸重置", sets: 2, repsOrDuration: "45 秒", restSeconds: 20 }
                ]
              },
              {
                day: 2,
                moves: [
                  { name: "硬拉基础", sets: 4, repsOrDuration: "8 次", restSeconds: 70, weightKg: 24 },
                  { name: "高脚杯箭步蹲", sets: 3, repsOrDuration: "12 次/侧", restSeconds: 55, weightKg: 16 },
                  { name: "臀桥", sets: 3, repsOrDuration: "16 次", restSeconds: 40 }
                ]
              },
              {
                day: 3,
                moves: [
                  { name: "爆发划船", sets: 4, repsOrDuration: "10 次", restSeconds: 55, weightKg: 20 },
                  { name: "侧平板抬升", sets: 3, repsOrDuration: "40 秒/侧", restSeconds: 25 },
                  { name: "呼吸重置", sets: 2, repsOrDuration: "50 秒", restSeconds: 20 }
                ]
              }
            ]
          }
        ]
      },
      "plan-lean-lower-3w-4x": {
        id: "plan-lean-lower-3w-4x",
        name: "精瘦下肢塑造",
        intro: "侧重臀部与腿部的下肢进阶周期，平衡力量组与单侧控制训练。",
        scene: "Strength Training",
        cycleWeeks: "3 Weeks",
        sessionsPerWeek: "4 Sessions",
        difficulty: "Intermediate",
        cover: "assets/card2.jpg",
        schedule: [
          {
            week: 1,
            days: [
              { day: 1, moves: [{ name: "壶铃深蹲", sets: 4, repsOrDuration: "10 次", restSeconds: 60, weightKg: 20 }, { name: "高脚杯箭步蹲", sets: 3, repsOrDuration: "10 次/侧", restSeconds: 55, weightKg: 16 }] },
              { day: 2, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "15 次", restSeconds: 45 }, { name: "硬拉基础", sets: 3, repsOrDuration: "8 次", restSeconds: 70, weightKg: 24 }] },
              { day: 3, moves: [{ name: "壶铃深蹲", sets: 3, repsOrDuration: "12 次", restSeconds: 55, weightKg: 18 }, { name: "侧平板抬升", sets: 3, repsOrDuration: "35 秒/侧", restSeconds: 30 }] },
              { day: 4, moves: [{ name: "高脚杯箭步蹲", sets: 4, repsOrDuration: "12 次/侧", restSeconds: 60, weightKg: 18 }, { name: "呼吸重置", sets: 2, repsOrDuration: "50 秒", restSeconds: 20 }] }
            ]
          },
          {
            week: 2,
            days: [
              { day: 1, moves: [{ name: "硬拉基础", sets: 4, repsOrDuration: "8 次", restSeconds: 75, weightKg: 28 }, { name: "臀桥", sets: 4, repsOrDuration: "16 次", restSeconds: 45 }] },
              { day: 2, moves: [{ name: "壶铃深蹲", sets: 4, repsOrDuration: "11 次", restSeconds: 60, weightKg: 22 }, { name: "高脚杯箭步蹲", sets: 3, repsOrDuration: "10 次/侧", restSeconds: 55, weightKg: 18 }] },
              { day: 3, moves: [{ name: "爆发划船", sets: 3, repsOrDuration: "10 次", restSeconds: 55, weightKg: 20 }, { name: "侧平板抬升", sets: 3, repsOrDuration: "40 秒/侧", restSeconds: 30 }] },
              { day: 4, moves: [{ name: "硬拉基础", sets: 4, repsOrDuration: "9 次", restSeconds: 75, weightKg: 30 }, { name: "呼吸重置", sets: 2, repsOrDuration: "45 秒", restSeconds: 20 }] }
            ]
          },
          {
            week: 3,
            days: [
              { day: 1, moves: [{ name: "壶铃深蹲", sets: 5, repsOrDuration: "8 次", restSeconds: 70, weightKg: 24 }, { name: "臀桥", sets: 4, repsOrDuration: "18 次", restSeconds: 45 }] },
              { day: 2, moves: [{ name: "高脚杯箭步蹲", sets: 4, repsOrDuration: "12 次/侧", restSeconds: 60, weightKg: 20 }, { name: "爆发划船", sets: 3, repsOrDuration: "12 次", restSeconds: 55, weightKg: 22 }] },
              { day: 3, moves: [{ name: "硬拉基础", sets: 5, repsOrDuration: "6 次", restSeconds: 80, weightKg: 34 }, { name: "侧平板抬升", sets: 3, repsOrDuration: "45 秒/侧", restSeconds: 30 }] },
              { day: 4, moves: [{ name: "壶铃深蹲", sets: 4, repsOrDuration: "10 次", restSeconds: 65, weightKg: 22 }, { name: "呼吸重置", sets: 2, repsOrDuration: "60 秒", restSeconds: 20 }] }
            ]
          }
        ]
      },
      "plan-pilates-core-4w-5x": {
        id: "plan-pilates-core-4w-5x",
        name: "普拉提核心习惯",
        intro: "高频率的普拉提节奏，通过短时每日训练，专注呼吸、躯干稳定与体态控制。",
        scene: "Pilates",
        cycleWeeks: "4 Weeks",
        sessionsPerWeek: "5 Sessions",
        difficulty: "Beginner",
        cover: "assets/card4.jpg",
        schedule: [
          {
            week: 1,
            days: [
              { day: 1, moves: [{ name: "普拉提核心流动", sets: 3, repsOrDuration: "45 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 2, repsOrDuration: "50 秒", restSeconds: 20 }] },
              { day: 2, moves: [{ name: "侧平板抬升", sets: 3, repsOrDuration: "30 秒/侧", restSeconds: 25 }, { name: "臀桥", sets: 3, repsOrDuration: "14 次", restSeconds: 35 }] },
              { day: 3, moves: [{ name: "普拉提核心流动", sets: 3, repsOrDuration: "50 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 2, repsOrDuration: "55 秒", restSeconds: 20 }] },
              { day: 4, moves: [{ name: "侧平板抬升", sets: 3, repsOrDuration: "35 秒/侧", restSeconds: 25 }, { name: "臀桥", sets: 3, repsOrDuration: "16 次", restSeconds: 35 }] },
              { day: 5, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "45 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 2, repsOrDuration: "60 秒", restSeconds: 20 }] }
            ]
          },
          {
            week: 2,
            days: [
              { day: 1, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "50 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 3, repsOrDuration: "35 秒/侧", restSeconds: 25 }] },
              { day: 2, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "16 次", restSeconds: 35 }, { name: "呼吸重置", sets: 2, repsOrDuration: "60 秒", restSeconds: 20 }] },
              { day: 3, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "55 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 3, repsOrDuration: "40 秒/侧", restSeconds: 25 }] },
              { day: 4, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "18 次", restSeconds: 35 }, { name: "呼吸重置", sets: 2, repsOrDuration: "65 秒", restSeconds: 20 }] },
              { day: 5, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "60 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 2, repsOrDuration: "60 秒", restSeconds: 20 }] }
            ]
          },
          {
            week: 3,
            days: [
              { day: 1, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "60 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 4, repsOrDuration: "35 秒/侧", restSeconds: 25 }] },
              { day: 2, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "18 次", restSeconds: 35 }, { name: "呼吸重置", sets: 2, repsOrDuration: "65 秒", restSeconds: 20 }] },
              { day: 3, moves: [{ name: "普拉提核心流动", sets: 4, repsOrDuration: "60 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 4, repsOrDuration: "40 秒/侧", restSeconds: 25 }] },
              { day: 4, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "20 次", restSeconds: 35 }, { name: "呼吸重置", sets: 2, repsOrDuration: "70 秒", restSeconds: 20 }] },
              { day: 5, moves: [{ name: "普拉提核心流动", sets: 5, repsOrDuration: "50 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 2, repsOrDuration: "70 秒", restSeconds: 20 }] }
            ]
          },
          {
            week: 4,
            days: [
              { day: 1, moves: [{ name: "普拉提核心流动", sets: 5, repsOrDuration: "55 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 4, repsOrDuration: "40 秒/侧", restSeconds: 25 }] },
              { day: 2, moves: [{ name: "臀桥", sets: 4, repsOrDuration: "20 次", restSeconds: 35 }, { name: "呼吸重置", sets: 3, repsOrDuration: "60 秒", restSeconds: 20 }] },
              { day: 3, moves: [{ name: "普拉提核心流动", sets: 5, repsOrDuration: "60 秒", restSeconds: 20 }, { name: "侧平板抬升", sets: 4, repsOrDuration: "45 秒/侧", restSeconds: 25 }] },
              { day: 4, moves: [{ name: "臀桥", sets: 5, repsOrDuration: "16 次", restSeconds: 35 }, { name: "呼吸重置", sets: 3, repsOrDuration: "65 秒", restSeconds: 20 }] },
              { day: 5, moves: [{ name: "普拉提核心流动", sets: 5, repsOrDuration: "60 秒", restSeconds: 20 }, { name: "呼吸重置", sets: 3, repsOrDuration: "70 秒", restSeconds: 20 }] }
            ]
          }
        ]
      }
    }
  }
};

(() => {
  const lib = window.PlanBDemo && window.PlanBDemo.libraryData;
  const details = lib && lib.allTraining && lib.allTraining.planDetails;
  if (!details || typeof details !== "object") return;
  const defaultErrorTypes = ["膝盖内扣", "幅度不足", "核心不稳"];
  Object.values(details).forEach((plan) => {
    const weeks = Array.isArray(plan && plan.schedule) ? plan.schedule : [];
    weeks.forEach((week) => {
      const days = Array.isArray(week && week.days) ? week.days : [];
      days.forEach((day) => {
        const moves = Array.isArray(day && day.moves) ? day.moves : [];
        moves.forEach((move) => {
          if (!move || typeof move !== "object") return;
          move.aiSupported = true;
          if (!move.aiQualityTemplate || typeof move.aiQualityTemplate !== "object") {
            move.aiQualityTemplate = {
              errorTypes: defaultErrorTypes
            };
          }
        });
      });
    });
  });
})();
