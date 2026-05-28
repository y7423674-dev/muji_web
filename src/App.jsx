import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  AlertCircle,
  Brain,
  CheckCircle2,
  Coffee,
  Contrast,
  Eye,
  Keyboard,
  Lightbulb,
  Menu,
  Play,
  RotateCcw,
  ScanLine,
  Shirt,
  Timer,
  Volume2,
  X,
} from "lucide-react";

const sections = [
  { id: "overview", label: "问题概览" },
  { id: "evidence", label: "视频证据" },
  { id: "logic", label: "识别逻辑" },
  { id: "psychology", label: "心理学分析" },
  { id: "accessibility", label: "无障碍体验" },
  { id: "comparison", label: "横向对比" },
  { id: "solution", label: "改进方案" },
];

const scanItems = [
  {
    key: "normal",
    name: "普通商品",
    icon: ScanLine,
    method: "条形码扫描",
    userAction: "用户需要找到条形码，并将其对准扫描区域。",
    issue: "规则相对稳定，但仍然要求用户自行寻找识别位置。",
    visual: "barcode",
    tip: "用户预期：拿起商品 → 对准扫描口 → 立即识别",
  },
  {
    key: "food",
    name: "食品商品",
    icon: Coffee,
    method: "二维码或特殊码扫描",
    userAction: "用户需要辨认二维码，有时还会因为干扰信息而产生误判。",
    issue: "视觉上像“可直接扫描”，但实际操作并不总是符合用户直觉。",
    visual: "qrcode",
    tip: "用户预期：看到二维码 = 可以直接扫",
  },
  {
    key: "clothing",
    name: "服装商品",
    icon: Shirt,
    method: "RFID 感应识别",
    userAction: "用户将商品放入感应区，系统自动读取。",
    issue: "效率更高，但与前两类商品放在同一流程中时，会造成规则断裂。",
    visual: "rfid",
    tip: "用户预期：不用扫，直接放入即可",
  },
];

const designCards = [
  {
    title: "统一视觉提示",
    text: "在商品包装、屏幕界面和扫描区域使用统一识别提示，让用户不用猜测该扫哪里、怎么扫。",
  },
  {
    title: "分步式结账引导",
    text: "将不同商品的识别方式拆成清晰步骤，用动效和图示降低用户判断成本。",
  },
  {
    title: "自动错误诊断",
    text: "扫描失败时，系统不只提示失败，而是说明可能原因，例如请旋转商品、请放入感应区。",
  },
  {
    title: "无障碍增强",
    text: "增加语音提示、大字号、高对比、键盘焦点和更宽松的操作时限。",
  },
];

const caseStudies = [
  {
    key: "uniqlo",
    brand: "UNIQLO",
    title: "RFID 批量识别",
    short: "把逐件扫码改为整体感应，让用户不必反复寻找标签位置。",
    detail:
      "UNIQLO 的自助收银通过 RFID 标签实现批量识别。用户把衣物放入感应区后，系统可以一次性读取商品信息。这种做法的启发在于：技术不一定要完全可见，关键是让用户动作更自然、更少中断。",
    strengths: ["减少逐件扫码", "适合服装库存管理", "结账动作更接近放下即可"],
    limits: ["标签成本更高", "食品类低价商品不一定适用", "液体和金属包装可能影响稳定性"],
    officialLink: "https://www.fastretailing.com/eng/",
    mediaLink: "https://www.youtube.com/results?search_query=uniqlo+rfid+self+checkout",
    visual: "rfidCase",
  },
  {
    key: "justwalkout",
    brand: "Amazon",
    title: "Just Walk Out",
    short: "通过计算机视觉、传感器融合与自动扣款，让用户尽量无需传统结账。",
    detail:
      "Just Walk Out 的核心不是单一识别技术，而是把摄像头、传感器、机器学习和支付系统整合到后台。用户只需要完成进入、拿取、离开这条自然行为链，不必理解商品到底如何被识别。",
    strengths: ["结账动作极少", "技术复杂性被隐藏", "适合快进快出场景"],
    limits: ["部署成本较高", "门店空间要求较高", "隐私与数据安全容易引发顾虑"],
    officialLink: "https://www.justwalkout.com/",
    mediaLink: "https://aws.amazon.com/just-walk-out/",
    visual: "walkout",
  },
  {
    key: "dashcart",
    brand: "Amazon / Whole Foods",
    title: "Dash Cart 智能购物车",
    short: "把识别过程前移到购物车阶段，边购物边结算。",
    detail:
      "Dash Cart 把结账反馈嵌入购物车。用户在购物过程中就能看到商品和金额变化，结账压力不再集中压缩到最后几分钟。",
    strengths: ["实时反馈更明确", "购物与结算融合", "比完全无感店更容易理解"],
    limits: ["仍需要学习购物车操作", "设备维护成本较高", "高峰期可能受购物车数量限制"],
    officialLink: "https://www.wholefoodsmarket.com/customer-service/topics/dash-carts",
    mediaLink: "https://www.amazon.com/b?ie=UTF8&node=21289116011",
    visual: "cart",
  },
  {
    key: "digimarc",
    brand: "Walmart / Digimarc",
    title: "隐形条码与连接包装",
    short: "将识别信息分布到包装表面，减少精准对准条码的麻烦。",
    detail:
      "隐形条码并不取消扫描，而是降低扫描动作的精度要求。它保留用户熟悉的扫码逻辑，但把包装变成更容易被机器读取的表面，从而减少失败率。",
    strengths: ["贴近原有扫码习惯", "减少对准动作", "降低收银失败率"],
    limits: ["需要包装系统配合", "依赖产业链协同", "前期改造成本较高"],
    officialLink: "https://www.digimarc.com/",
    mediaLink: "https://www.digimarc.com/products/digimarc-barcode",
    visual: "package",
  },
];

const checkoutOptions = [
  { key: "barcode", label: "普通商品", method: "对准条形码", helper: "寻找包装背面的条形码标签。" },
  { key: "qr", label: "食品商品", method: "查看二维码提示", helper: "注意屏幕提示，避免误扫非商品识别码。" },
  { key: "rfid", label: "服装商品", method: "放入 RFID 感应区", helper: "将衣物平放到感应区，等待系统读取。" },
];

function runComponentSelfTests() {
  console.assert(sections.length === 7, "sections should contain seven navigation items");
  console.assert(scanItems.every((item) => item.name && item.method && item.visual), "each scan item should have required fields");
  console.assert(caseStudies.length >= 4, "case study list should include at least four examples");
  console.assert(checkoutOptions.length === 3, "checkout simulation should include three item types");
}

runComponentSelfTests();

function NavBar() {
  const [open, setOpen] = useState(false);

  const handleJump = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200/80 bg-[#f7f3ea]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <button type="button" onClick={() => handleJump("hero")} className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-stone-800 text-xs font-semibold tracking-widest text-stone-800 transition group-hover:bg-stone-800 group-hover:text-[#f7f3ea]">
            良
          </div>
          <div className="text-left">
            <p className="text-sm font-medium tracking-[0.25em] text-stone-900">MUJI SELF CHECKOUT</p>
            <p className="text-xs text-stone-500">交互设计问题分析</p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleJump(item.id)}
              className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-white hover:text-stone-950"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="打开导航菜单">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-stone-200 bg-[#f7f3ea] px-5 py-3 md:hidden">
          <div className="grid gap-2">
            {sections.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleJump(item.id)}
                className="rounded-xl px-4 py-3 text-left text-sm text-stone-700 hover:bg-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-stone-500">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-stone-600">{desc}</p>
    </div>
  );
}

function SoftPanel({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-sm ${className}`}>{children}</div>;
}

function OverviewFlow() {
  const items = [
    {
      title: "用户预期",
      text: "消费者默认同一结账任务应遵循稳定规则，只要将识别码对准扫描区域，系统就应自动完成识别。",
    },
    {
      title: "系统现实",
      text: "同一收银场景中同时出现条形码、二维码和 RFID，不同商品对应不同操作逻辑。",
    },
    {
      title: "体验后果",
      text: "用户被迫临时判断这件商品该怎么识别，认知负荷、操作成本和焦虑感同步上升。",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
      {items.map((item, index) => (
        <React.Fragment key={item.title}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm"
          >
            <p className="text-sm tracking-[0.25em] text-stone-400">STEP 0{index + 1}</p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-950">{item.title}</h3>
            <p className="mt-4 leading-8 text-stone-600">{item.text}</p>
          </motion.div>
          {index < items.length - 1 ? (
            <div className="hidden items-center justify-center lg:flex">
              <div className="rounded-full border border-stone-300 bg-[#f7f3ea] px-4 py-2 text-stone-500">→</div>
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function BarcodeVisual() {
  const bars = [5, 2, 9, 3, 7, 2, 11, 4, 3, 8, 2, 10, 5, 3, 7, 2, 12, 4, 6, 2, 9, 3, 5, 11, 2, 4, 8, 3];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 text-sm text-stone-500">商品包装 · 条形码标签</div>
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-[#eee7d8] p-5">
        <div className="absolute right-4 top-4 rounded-full border border-stone-300 px-3 py-1 text-xs tracking-[0.18em] text-stone-500">MUJI</div>
        <div className="mb-10 mt-5 h-4 w-28 rounded-full bg-stone-200" />
        <div className="rounded-xl border border-stone-300 bg-white p-4 shadow-sm">
          <div className="flex h-24 items-end justify-center gap-[2px]">
            {bars.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className="bg-stone-950"
                style={{ width: `${width}px`, height: `${index % 3 === 0 ? 88 : index % 3 === 1 ? 74 : 96}px` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.3em] text-stone-500">
            <span>4 550343</span>
            <span>918027</span>
          </div>
        </div>
        <motion.div
          animate={{ x: [0, 220, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="mt-4 h-[2px] w-24 bg-stone-900"
        />
      </div>
      <p className="mt-4 text-sm text-stone-500">更接近真实包装标签，用户需要先找到条形码，再把标签对准扫描线。</p>
    </div>
  );
}

function QRVisual() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 1, 1, 1, 0, 1, 1, 0,
    0, 0, 1, 0, 1, 1, 0, 1,
    1, 0, 0, 1, 1, 0, 1, 0,
    0, 1, 1, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 0, 0, 1, 0, 1, 0,
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 text-sm text-stone-500">食品包装 · 二维码区</div>
      <div className="w-fit rounded-xl border border-stone-200 bg-[#fbf8f1] p-4">
        <div className="grid w-40 grid-cols-8 gap-1">
          {cells.map((cell, index) => (
            <div key={`${cell}-${index}`} className={`${cell ? "bg-stone-900" : "bg-stone-200"} aspect-square rounded-[2px]`} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-stone-500">视觉上像直接可扫，但实际规则可能让用户误判。</p>
    </div>
  );
}

function RFIDVisual() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 text-sm text-stone-500">服装商品 · RFID 感应区</div>
      <div className="relative flex h-52 items-center justify-center rounded-xl border border-stone-200 bg-[#fbf8f1]">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute h-28 w-28 rounded-full border border-stone-400"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 0.2 }}
          className="absolute h-40 w-40 rounded-full border border-stone-300"
        />
        <div className="relative rounded-2xl border border-stone-300 bg-white px-6 py-10 text-stone-900 shadow-sm">衣物 / RFID 标签</div>
      </div>
      <p className="mt-4 text-sm text-stone-500">用户无需逐一扫码，但与扫码规则并置后会形成落差。</p>
    </div>
  );
}

function ProductVisual({ type }) {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-xs tracking-[0.25em] text-stone-400">VISUAL DEMO</p>
      <h4 className="mt-2 text-xl font-semibold text-stone-950">识别方式示意</h4>
      <div className="mt-6 rounded-3xl bg-[#f7f3ea] p-6">
        {type === "barcode" ? <BarcodeVisual /> : null}
        {type === "qrcode" ? <QRVisual /> : null}
        {type === "rfid" ? <RFIDVisual /> : null}
      </div>
    </div>
  );
}

function EvidenceVideo() {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-stone-400">FIELD OBSERVATION</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-950">扫码问题现场视频</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
            <ScanLine size={22} />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-stone-950">
        <video className="evidence-video" controls preload="metadata" playsInline>
          <source src="/scan-problem.mp4" type="video/mp4" />
          当前浏览器无法播放该视频。
        </video>
        </div>

        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="mt-4 rounded-full border border-stone-300 px-5 py-3 text-sm text-stone-700 transition hover:bg-[#f7f3ea]"
        >
          {showHint ? "收起视频使用说明" : "视频无法播放时怎么办"}
        </button>

        {showHint ? (
          <div className="mt-4 rounded-3xl bg-[#f7f3ea] p-5 text-sm leading-7 text-stone-600">
            如果预览里视频无法播放，不代表代码有问题。正式运行时，把视频文件放到项目 public 文件夹，并保持文件名为“扫码问题.mp4”。Vite 或 React 项目中通常使用 /扫码问题.mp4。
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        {[
          ["观察对象", "用户在 MUJI 自助结账中面对扫码识别不稳定或规则不清的问题。"],
          ["可呈现内容", "视频可以作为课堂展示中的第一手材料，帮助观众先看到问题，再理解分析。"],
          ["分析入口", "观看时重点关注用户是否需要反复调整角度、寻找识别码、等待反馈或重新尝试。"],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm tracking-[0.25em] text-stone-400">VIDEO NOTE</p>
            <h4 className="mt-2 text-xl font-semibold text-stone-950">{title}</h4>
            <p className="mt-3 leading-7 text-stone-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScanSimulator() {
  const [active, setActive] = useState(scanItems[0]);
  const ActiveIcon = active.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-3">
        {scanItems.map((item) => {
          const Icon = item.icon;
          const selected = active.key === item.key;

          return (
            <button
              type="button"
              key={item.key}
              onClick={() => setActive(item)}
              className={`rounded-3xl border p-5 text-left transition ${selected ? "border-stone-900 bg-white shadow-sm" : "border-stone-200 bg-[#fbf8f1] hover:border-stone-400"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selected ? "bg-stone-900 text-white" : "bg-white text-stone-600"}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">{item.method}</p>
                  </div>
                </div>
                <span className="hidden rounded-full bg-[#f7f3ea] px-3 py-1 text-xs text-stone-500 sm:inline-block">点击查看</span>
              </div>

              <div className="mt-4 rounded-2xl bg-[#f7f3ea] p-4">
                <p className="text-xs tracking-[0.2em] text-stone-400">用户预期</p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{item.tip}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        <motion.div
          key={`${active.key}-text`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm tracking-[0.25em] text-stone-400">CURRENT ITEM</p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-950">{active.name}</h3>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#efe7d7] text-stone-800">
              <ActiveIcon size={30} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-[#f7f3ea] p-5">
              <p className="text-xs font-semibold tracking-[0.25em] text-stone-500">用户动作</p>
              <p className="mt-2 text-lg text-stone-900">{active.userAction}</p>
            </div>
            <div className="rounded-3xl bg-stone-950 p-5 text-white">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-stone-300">
                <AlertCircle size={16} />潜在问题
              </p>
              <p className="mt-2 leading-7 text-stone-100">{active.issue}</p>
            </div>
          </div>
        </motion.div>

        <motion.div key={`${active.key}-visual`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <ProductVisual type={active.visual} />
        </motion.div>
      </div>
    </div>
  );
}

function PsychologyTabs() {
  const tabs = [
    {
      name: "心理模型",
      icon: Brain,
      body: "消费者会基于过往经验预判系统如何运行。当用户认为所有可扫描符号都能用同一方式识别，而机器实际要求不同操作时，系统逻辑便与用户经验错位。",
    },
    {
      name: "一致性原则",
      icon: CheckCircle2,
      body: "同一任务应尽量遵循同一规则。结账过程里反复切换条形码、二维码和 RFID，会打断用户的自动化操作流程。",
    },
    {
      name: "认知负荷",
      icon: Lightbulb,
      body: "用户原本只想快速付款，却被迫判断商品类别、识别方式和失败原因。机器把后台复杂性转移到了消费者身上。",
    },
  ];
  const [index, setIndex] = useState(0);
  const active = tabs[index];
  const ActiveIcon = active.icon;

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm md:p-6">
      <div className="grid gap-3 md:grid-cols-3">
        {tabs.map((tab, tabIndex) => {
          const TabIcon = tab.icon;
          return (
            <button
              type="button"
              key={tab.name}
              onClick={() => setIndex(tabIndex)}
              className={`rounded-2xl p-4 text-left transition ${index === tabIndex ? "bg-stone-950 text-white" : "bg-[#f7f3ea] text-stone-700 hover:bg-[#efe7d7]"}`}
            >
              <TabIcon size={20} />
              <p className="mt-3 font-medium">{tab.name}</p>
            </button>
          );
        })}
      </div>
      <motion.div key={active.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-3xl bg-[#fbf8f1] p-8">
        <ActiveIcon className="mb-5 text-stone-800" size={32} />
        <h3 className="text-2xl font-semibold text-stone-950">{active.name}</h3>
        <p className="mt-4 max-w-3xl text-lg leading-9 text-stone-600">{active.body}</p>
      </motion.div>
    </div>
  );
}

function AccessibilityLab() {
  const [largeText, setLargeText] = useState(false);
  const [lowStimulus, setLowStimulus] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(true);
  const [extendedTime, setExtendedTime] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remaining, setRemaining] = useState(45);
  const [selectedItem, setSelectedItem] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("请选择商品类型，然后在倒计时内完成识别与付款。扶稳小推车，我们开始模拟。");

  const totalTime = extendedTime ? 120 : 45;

  const resetCheckout = (nextTotal = totalTime) => {
    setTimerRunning(false);
    setRemaining(nextTotal);
    setSelectedItem(null);
    setScanStatus("idle");
    setPaid(false);
    setMessage("请选择商品类型，然后在倒计时内完成识别与付款。扶稳小推车，我们开始模拟。");
  };

  const toggleExtendedTime = (checked) => {
    setExtendedTime(checked);
    resetCheckout(checked ? 120 : 45);
  };

  const startTask = () => {
    setTimerRunning(true);
    setRemaining(totalTime);
    setSelectedItem(null);
    setScanStatus("idle");
    setPaid(false);
    setMessage("倒计时已开始。请先选择商品类型，再执行识别操作。");
  };

  const chooseItem = (item) => {
    if (!timerRunning || remaining <= 0) {
      setMessage("请先点击开始任务。没有开始倒计时，系统不会进入结账流程。");
      return;
    }
    setSelectedItem(item);
    setScanStatus("ready");
    setPaid(false);
    setMessage(`${item.label}已选择。下一步：${item.method}。`);
  };

  const scanItem = () => {
    if (!timerRunning || remaining <= 0) {
      setMessage("时间未启动或已经结束，请重新开始任务。");
      return;
    }
    if (!selectedItem) {
      setScanStatus("error");
      setMessage("还没有选择商品类型。对认知障碍或首次使用者来说，缺少步骤提示会放大这种迷路感。");
      return;
    }
    setScanStatus("success");
    setMessage(`${selectedItem.label}识别成功。现在可以确认付款。`);
  };

  const confirmPay = () => {
    if (!timerRunning || remaining <= 0) {
      setMessage("时间已结束，流程被中断。延长时限可以让用户有更从容的操作窗口。");
      return;
    }
    if (scanStatus !== "success") {
      setMessage("还没有完成商品识别，不能付款。清晰的状态反馈可以减少重复试错。");
      return;
    }
    setPaid(true);
    setTimerRunning(false);
    setMessage("模拟完成：用户在时限内完成了选择、识别和付款。");
  };

  useEffect(() => {
    if (!timerRunning) return undefined;
    if (remaining <= 0) {
      setTimerRunning(false);
      if (!paid) setMessage("倒计时结束：任务未完成。短时限会增加老年用户、行动障碍者和首次使用者的压力。");
      return undefined;
    }
    const id = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timerRunning, remaining, paid]);

  const speakGuide = () => {
    const text = "请先选择商品类型，再根据屏幕提示完成识别。普通商品请对准条形码，食品商品请查看二维码提示，服装商品请放入 RFID 感应区。识别成功后，请点击确认付款。";
    setVoiceEnabled(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const previewClass = `rounded-[2.4rem] border p-6 shadow-sm transition ${highContrast ? "border-white bg-black text-white" : "border-stone-200 bg-white text-stone-900"} ${largeText ? "text-[18px]" : "text-base"} ${lowStimulus ? "saturate-50" : ""}`;
  const timerPercent = Math.max(0, Math.min(100, (remaining / totalTime) * 100));
  const disabledClass = !timerRunning || remaining <= 0 ? "opacity-45" : "";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
      <SoftPanel className="h-fit lg:sticky lg:top-28">
        <div className="flex items-center gap-3">
          <Accessibility size={26} />
          <h3 className="text-2xl font-semibold text-stone-950">无障碍体验控制台</h3>
        </div>
        <p className="mt-3 leading-7 text-stone-600">左侧调整辅助设置，右侧完成带倒计时的结账任务。这样“延长时限”才真正进入操作流程。</p>

        <div className="mt-6 grid gap-3">
          {[
            { label: "大字号模式", checked: largeText, setter: setLargeText, icon: Eye },
            { label: "低刺激显示", checked: lowStimulus, setter: setLowStimulus, icon: Eye },
            { label: "高对比模式", checked: highContrast, setter: setHighContrast, icon: Contrast },
            { label: "增强键盘焦点", checked: keyboardFocus, setter: setKeyboardFocus, icon: Keyboard },
          ].map((control) => {
            const ControlIcon = control.icon;
            return (
              <label key={control.label} className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#f7f3ea] p-4 transition hover:bg-[#efe7d7]">
                <span className="flex items-center gap-3 text-stone-800">
                  <ControlIcon size={18} />
                  {control.label}
                </span>
                <input type="checkbox" checked={control.checked} onChange={(event) => control.setter(event.target.checked)} className="h-5 w-5 accent-stone-900" />
              </label>
            );
          })}

          <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#f7f3ea] p-4 transition hover:bg-[#efe7d7]">
            <span className="flex items-center gap-3 text-stone-800">
              <Timer size={18} />
              延长操作时限
            </span>
            <input type="checkbox" checked={extendedTime} onChange={(event) => toggleExtendedTime(event.target.checked)} className="h-5 w-5 accent-stone-900" />
          </label>

          <button type="button" onClick={speakGuide} className="flex items-center gap-3 rounded-2xl bg-stone-950 px-5 py-4 text-left text-white transition hover:bg-stone-800">
            <Volume2 size={18} />
            播放语音引导
          </button>
        </div>
      </SoftPanel>

      <div className={previewClass}>
        <div className="flex flex-col justify-between gap-5 border-b border-current/10 pb-5 md:flex-row md:items-start">
          <div>
            <p className="text-xs tracking-[0.25em] opacity-60">ACCESSIBLE CHECKOUT SIMULATION</p>
            <h4 className="mt-3 text-3xl font-semibold">带倒计时的结账任务</h4>
            <p className="mt-3 max-w-2xl leading-7 opacity-75">请在限定时间内完成：选择商品类型 → 执行识别 → 确认付款。这个小任务用来模拟自助收银中“时间压力 + 步骤理解”的叠加负担。</p>
          </div>
          <div className={`rounded-3xl p-5 text-center ${highContrast ? "bg-neutral-900" : "bg-stone-950 text-white"}`}>
            <p className="text-xs opacity-70">剩余时间</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">{remaining}</p>
            <p className="text-xs opacity-70">秒 / {totalTime} 秒</p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-current/10">
          <motion.div className={`h-full rounded-full ${highContrast ? "bg-white" : "bg-stone-950"}`} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={startTask} className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm transition ${highContrast ? "bg-white text-black" : "bg-stone-950 text-white hover:bg-stone-800"}`}>
            <Play size={15} />开始任务
          </button>
          <button type="button" onClick={() => resetCheckout()} className="flex items-center gap-2 rounded-full border border-current/20 px-5 py-3 text-sm transition hover:bg-current/5">
            <RotateCcw size={15} />重置
          </button>
          <span className="rounded-full border border-current/20 px-5 py-3 text-sm opacity-80">语音状态：{voiceEnabled ? "已启动" : "未启动"}</span>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className={`rounded-3xl p-5 ${highContrast ? "bg-neutral-900" : "bg-[#f7f3ea]"}`}>
            <p className="mb-4 text-sm font-semibold opacity-80">第一步：选择商品类型</p>
            <div className="grid gap-3">
              {checkoutOptions.map((item) => {
                const selected = selectedItem?.key === item.key;
                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => chooseItem(item)}
                    className={`rounded-2xl border p-4 text-left transition ${selected ? "border-current bg-white/70 shadow-sm" : "border-current/10 bg-white/40 hover:bg-white/70"} ${disabledClass}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs opacity-60">{item.method}</span>
                    </div>
                    <p className="mt-2 text-sm opacity-70">{item.helper}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`rounded-3xl p-5 ${highContrast ? "bg-neutral-900" : "bg-[#f7f3ea]"}`}>
            <p className="mb-4 text-sm font-semibold opacity-80">第二步与第三步：识别并付款</p>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={scanItem}
                className={`min-h-36 rounded-3xl border border-current/10 p-5 text-left transition hover:bg-white/70 ${keyboardFocus ? "focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-stone-400" : ""} ${scanStatus === "success" ? "bg-white/80" : "bg-white/40"}`}
              >
                <ScanLine size={24} />
                <p className="mt-4 text-lg font-semibold">执行识别</p>
                <p className="mt-2 text-sm opacity-70">模拟扫码、查看提示或 RFID 感应。</p>
              </button>
              <button
                type="button"
                onClick={confirmPay}
                className={`min-h-36 rounded-3xl border border-current/10 p-5 text-left transition hover:bg-white/70 ${keyboardFocus ? "focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-stone-400" : ""} ${paid ? "bg-white/80" : "bg-white/40"}`}
              >
                <CheckCircle2 size={24} />
                <p className="mt-4 text-lg font-semibold">确认付款</p>
                <p className="mt-2 text-sm opacity-70">只有识别成功后才能完成结账。</p>
              </button>
            </div>

            <div className={`mt-5 rounded-3xl p-5 ${highContrast ? "bg-black" : "bg-white"}`}>
              <p className="text-sm font-semibold opacity-70">系统反馈</p>
              <p className="mt-2 min-h-[56px] leading-7">{message}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["商品", selectedItem ? selectedItem.label : "未选择"],
                  ["识别", scanStatus === "success" ? "成功" : scanStatus === "error" ? "出错" : scanStatus === "ready" ? "待识别" : "未开始"],
                  ["付款", paid ? "已完成" : "未完成"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-current/10 p-3">
                    <p className="text-xs opacity-50">{label}</p>
                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 opacity-70">对比重点：关闭延长时限时，用户只有 45 秒完成整套流程；开启后变为 120 秒。它不只是数字变长，而是实际改变了完成任务的容错空间。</p>
      </div>
    </div>
  );
}

function CaseVisual({ type }) {
  if (type === "rfidCase") {
    return (
      <div className="rounded-3xl bg-[#f7f3ea] p-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">RFID 自助收银流程</p>
          <div className="mt-4 grid gap-3">
            {["将衣物放入感应区", "系统批量读取 RFID 标签", "屏幕生成商品清单", "用户确认付款"].map((text, index) => (
              <div key={text} className="rounded-xl border border-stone-200 bg-[#fbf8f1] p-4">
                0{index + 1} · {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "walkout") {
    return (
      <div className="rounded-3xl bg-[#f7f3ea] p-6">
        <div className="grid gap-3">
          {["入店绑定支付方式", "拿取或放回商品", "直接离店", "后台自动识别与扣款"].map((text, index) => (
            <div key={text} className={`rounded-2xl p-4 shadow-sm ${index === 3 ? "bg-stone-950 text-white" : "bg-white text-stone-800"}`}>
              {text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div className="rounded-3xl bg-[#f7f3ea] p-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-sm text-stone-500">智能购物车屏幕</div>
          <div className="mt-4 rounded-xl bg-stone-950 p-4 text-white">已加入商品 3 件 · 合计 ¥128</div>
          <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">边购物边反馈，结账压力被分散</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#f7f3ea] p-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-sm text-stone-500">包装表面示意</div>
        <div className="mt-4 rounded-xl border border-dashed border-stone-400 p-8 text-center">包装多处可识别</div>
        <div className="mt-3 text-sm text-stone-500">减少必须精准对准码区的动作要求。</div>
      </div>
    </div>
  );
}

function CaseExplorer() {
  const [active, setActive] = useState(caseStudies[0]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-3">
        {caseStudies.map((item) => (
          <button
            type="button"
            key={item.key}
            onClick={() => setActive(item)}
            className={`rounded-3xl border p-5 text-left transition ${active.key === item.key ? "border-stone-900 bg-white shadow-sm" : "border-stone-200 bg-[#fbf8f1] hover:border-stone-400"}`}
          >
            <p className="text-sm tracking-[0.25em] text-stone-400">{item.brand}</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-950">{item.title}</h3>
            <p className="mt-3 leading-7 text-stone-600">{item.short}</p>
          </button>
        ))}
      </div>

      <motion.div key={active.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs tracking-[0.25em] text-stone-400">{active.brand}</p>
        <h3 className="mt-2 text-3xl font-semibold text-stone-950">{active.title}</h3>
        <p className="mt-4 leading-8 text-stone-600">{active.detail}</p>

        <div className="mt-6">
          <CaseVisual type={active.visual} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-[#f7f3ea] p-5">
            <p className="text-sm font-semibold text-stone-900">优点</p>
            <ul className="mt-3 space-y-2 text-stone-600">
              {active.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-[#f7f3ea] p-5">
            <p className="text-sm font-semibold text-stone-900">局限</p>
            <ul className="mt-3 space-y-2 text-stone-600">
              {active.limits.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-stone-200 bg-[#fbf8f1] p-4 text-sm leading-7 text-stone-600">
          预览环境有时会限制新标签页或外部跳转。正式部署到浏览器后，下面两个按钮通常可以正常打开；课堂展示时也可以把链接复制到浏览器地址栏。
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href={active.officialLink} target="_blank" rel="noreferrer noopener" className="rounded-full bg-stone-950 px-5 py-3 text-sm text-white transition hover:bg-stone-800">
            查看官方页面
          </a>
          <a href={active.mediaLink} target="_blank" rel="noreferrer noopener" className="rounded-full border border-stone-300 px-5 py-3 text-sm text-stone-800 transition hover:bg-[#f7f3ea]">
            打开相关视频 / 图片 / 介绍
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function BeforeAfterSlider() {
  const [value, setValue] = useState(30);
  const userLoad = 100 - value;
  const systemSupport = value;

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-stone-950">改进前后动态对比</h3>
        <p className="mt-2 text-stone-500">向右拖动，表示系统承担更多识别与解释任务，用户的认知负担随之下降。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-[#f7f3ea] p-5">
          <p className="text-sm font-semibold text-stone-900">用户认知负担</p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-stone-200">
            <motion.div className="h-full rounded-full bg-stone-900" animate={{ width: `${userLoad}%` }} transition={{ duration: 0.25 }} />
          </div>
          <p className="mt-3 text-3xl font-semibold text-stone-950">{userLoad}%</p>
          <p className="mt-2 min-h-[56px] text-stone-600">
            {userLoad > 60 ? "用户需要频繁判断商品识别方式。" : userLoad > 35 ? "用户仍有一定判断压力，但系统开始提供帮助。" : "大部分识别压力已由系统承担。"}
          </p>
        </div>

        <div className="rounded-3xl bg-stone-950 p-5 text-white">
          <p className="text-sm font-semibold text-stone-200">系统支持程度</p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-stone-700">
            <motion.div className="h-full rounded-full bg-white" animate={{ width: `${systemSupport}%` }} transition={{ duration: 0.25 }} />
          </div>
          <p className="mt-3 text-3xl font-semibold">{systemSupport}%</p>
          <p className="mt-2 min-h-[56px] text-stone-300">
            {systemSupport < 40 ? "系统仍然把复杂规则暴露给用户。" : systemSupport < 70 ? "系统开始通过提示和解释减轻用户负担。" : "系统已能较充分地隐藏技术复杂性。"}
          </p>
        </div>
      </div>

      <input type="range" min="10" max="90" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-8 w-full accent-stone-900" aria-label="调节改进前后对比" />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["改进前", "用户适应机器，频繁试错。"],
          ["过渡状态", "系统开始给出分类提示与失败解释。"],
          ["改进后", "系统理解用户，技术复杂性后移。"],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl bg-[#f7f3ea] p-4">
            <p className="font-medium">{title}</p>
            <p className="mt-2 text-stone-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MujiInteractivePage() {
  return (
    <div className="min-h-screen scroll-smooth bg-[#f7f3ea] text-base text-stone-900">
      <NavBar />

      <main id="hero" className="mx-auto max-w-6xl px-5 pt-32">
        <section className="grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-5 text-xs font-semibold tracking-[0.45em] text-stone-500">MINIMAL INTERACTION DESIGN</p>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-stone-950 md:text-7xl">看似安静的收银台，藏着吵闹的交互问题。</h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-stone-600">
              本研究围绕 MUJI 自助结账中扫码规则不统一的问题展开，重点分析其在用户预期、一致性原则、认知负荷与无障碍体验上的交互缺陷，并结合零售行业案例提出改进方向。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button type="button" onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
                开始浏览
              </button>
              <button type="button" onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-950 hover:bg-white">
                查看方案
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-[2.5rem] border border-stone-200 bg-[#fbf8f1] p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <p className="text-xs tracking-[0.25em] text-stone-400">SELF CHECKOUT</p>
                <p className="mt-2 text-xl font-medium">扫码任务状态</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-stone-900" />
            </div>
            <div className="space-y-4">
              {[
                ["普通商品", "条形码"],
                ["食品商品", "二维码"],
                ["服装商品", "RFID"],
              ].map(([name, type], index) => (
                <div key={name} className="flex items-center justify-between rounded-3xl bg-white p-5">
                  <span className="text-stone-700">{name}：{type}</span>
                  <span className="text-xs text-stone-400">0{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-3xl bg-stone-950 p-5 text-white">
              <p className="text-sm text-stone-300">核心矛盾</p>
              <p className="mt-2 text-xl font-medium">技术逻辑合理，但用户体验不统一。</p>
            </div>
          </motion.div>
        </section>

        <section id="overview" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="01 / OVERVIEW"
            title="问题不只是扫不出来，而是用户不知道为什么扫不出来"
            desc="这一部分只保留核心逻辑结构，直接呈现用户预期、系统现实与体验后果之间的关系。"
          />
          <OverviewFlow />
        </section>

        <section id="evidence" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="02 / EVIDENCE"
            title="先看见问题，再进入分析"
            desc="把现场视频放在理论分析之前，可以让网页更像一份有观察依据的交互设计报告，而不是只停留在概念说明。"
          />
          <EvidenceVideo />
        </section>

        <section id="logic" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="03 / LOGIC"
            title="把三种商品放进同一个结账场景，问题就浮出水面"
            desc="点击左侧不同商品类型，右侧会同步显示它的识别方式、用户动作、潜在问题与视觉示意。"
          />
          <ScanSimulator />
        </section>

        <section id="psychology" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="04 / PSYCHOLOGY"
            title="极简设计不止是视觉干净，更是认知轻盈"
            desc="MUJI 的视觉语言以克制、秩序和留白见长，但自助结账的体验并未完全延续这种精神。真正的极简应减少解释成本，而不是让用户成为系统规则的临时翻译员。"
          />
          <PsychologyTabs />
        </section>

        <section id="accessibility" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="05 / ACCESSIBILITY"
            title="当系统只服务标准用户，特殊群体就会被留在流程之外"
            desc="这部分不仅说明问题，也把网页本身做成了一个可体验的无障碍实验区。"
          />
          <AccessibilityLab />
        </section>

        <section id="comparison" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="06 / COMPARISON"
            title="好的智能零售，会把复杂性悄悄藏到后台"
            desc="通过点击不同案例，可以查看其交互逻辑、优点、局限，以及相关页面或资料入口。"
          />
          <CaseExplorer />
        </section>

        <section id="solution" className="scroll-mt-28 py-24">
          <SectionTitle
            eyebrow="07 / SOLUTION"
            title="改进方向：让机器多想一点，让用户少想一点"
            desc="设计目标不是强行把所有技术变成同一种，而是在前台建立统一、清晰、可解释的操作体验。"
          />
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <BeforeAfterSlider />
            <div className="grid gap-4">
              {designCards.map((card) => (
                <div key={card.title} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-stone-950">
                    <CheckCircle2 size={20} />{card.title}
                  </h3>
                  <p className="mt-3 leading-7 text-stone-600">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-stone-200 bg-[#efe7d7] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-stone-600">MUJI 自助结账扫码不统一的交互设计问题分析 · 课程网页作业</p>
          <p className="text-sm text-stone-500">Less visual noise, less cognitive weight.</p>
        </div>
      </footer>
    </div>
  );
}
