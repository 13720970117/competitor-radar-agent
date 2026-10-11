'use client';

import { useMemo, useState } from 'react';

type Relation = 'direct' | 'indirect' | 'substitute';
type Competitor = { name: string; relation: Relation; url: string; notes: string };
type Analysis = {
  competitorSummaries: Array<{ name: string; relation: string; summary: string; confidence: string }>;
  conclusions: Array<{ label: string; title: string; text: string }>;
  dimensionRows: Array<{ dimension: string; values: Array<{ name: string; rating: string; level: 'strong' | 'medium' | 'unknown'; evidence: string }> }>;
  recommendations: Array<{ title: string; rationale: string; action: string }>;
  verificationTasks: string[];
  mode: string; generatedAt: string; dataBasis: string;
};

const blank = (): Competitor => ({ name: '', relation: 'direct', url: '', notes: '' });
const samples: Competitor[] = [
  { name: '花小猪打车', relation: 'direct', url: 'https://apps.apple.com/cn/app/id1496121983', notes: '强调实惠、年轻有趣的日常出行；覆盖多品牌多车型叫车、顺风车、代驾、会员积分、优惠券、费用异常保障和安全官。待核验覆盖城市、同路线价格、高峰等待和司机供给。' },
  { name: '滴滴', relation: 'direct', url: 'https://www.didiglobal.com/', notes: '一站式综合出行平台；覆盖网约车、出租车、两轮车、顺风车、拼车、租车、包车、代驾、送货、会员和海外出行，并提供 AI 叫车。待核验不同城市价格、派单效率和会员付费率。' },
  { name: '曹操出行', relation: 'direct', url: 'https://www.caocao.com.cn/', notes: '强调绿色共享、品质服务和科技化运力；覆盖惠选、出租车、定制车、专车、企业商旅及 Robotaxi，依托新能源定制车辆和智能运营形成差异化。待核验价格、等待时间和 Robotaxi 开放范围。' },
];
const goals = [
  ['differentiation', '寻找差异化定位与机会点'],
  ['feature', '学习对手的功能设计'],
  ['market', '判断市场进入与目标客群'],
  ['business', '比较商业模式与盈利方式'],
] as const;

export default function Home() {
  const [competitors, setCompetitors] = useState<Competitor[]>([blank(), blank(), blank()]);
  const [goal, setGoal] = useState('differentiation');
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canSubmit = useMemo(() => new Set(competitors.map((item) => item.name.trim().toLowerCase()).filter(Boolean)).size === 3, [competitors]);

  function update(index: number, key: keyof Competitor, value: string) {
    setCompetitors((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  async function submit(event: { preventDefault(): void }) {
    event.preventDefault();
    setError('');
    if (!canSubmit) return setError('请填写三个不同的竞品名称。');
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors, analysisGoal: goal }),
      });
      const payload = await response.json() as { analysis?: Analysis; error?: string };
      if (!response.ok || !payload.analysis) throw new Error(payload.error || '分析失败，请稍后重试');
      setResult(payload.analysis);
      window.setTimeout(() => document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth' }), 80);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="竞品雷达首页"><span>CR</span><div><strong>竞品雷达</strong><small>Competitive Research Agent</small></div></a>
        <div className="prototype">AI 产品经理作品集 Demo</div>
      </header>
      <main id="top">
        <section className="hero">
          <div><p className="eyebrow">AI 产品经理实验工具</p><h1>把三个竞品名称，变成一张可行动的竞争地图</h1><p className="lead">先明确分析目的，再从七个维度完成初筛。没有证据的地方保留“待核验”，避免把模型推断当成事实。</p><div className="pills"><span>7 个分析维度</span><span>证据强度标记</span><span>差异化建议</span></div></div>
          <aside className="hero-note"><b>验证假设 01</b><p>少量竞品资料能否帮助产品经理快速发现研究缺口，并形成下一步行动？</p><small>预计完成时间 <strong>2 分钟</strong></small></aside>
        </section>
        <section className="workspace">
          <div className="section-head"><div><p>STEP 01</p><h2>输入竞品资料</h2></div><button type="button" onClick={() => setCompetitors(samples)}>填入示例</button></div>
          <form onSubmit={submit}>
            <div className="competitor-grid">
              {competitors.map((item, index) => (
                <article className="competitor-card" key={index} data-number={"0" + (index + 1)}>
                  <h3>竞品 {index + 1}</h3>
                  <label><span>竞品名称 *</span><input value={item.name} maxLength={60} onChange={(event) => update(index, 'name', event.target.value)} placeholder="例如 Intercom" /></label>
                  <label><span>竞品关系</span><select value={item.relation} onChange={(event) => update(index, 'relation', event.target.value)}><option value="direct">直接竞品</option><option value="indirect">间接竞品</option><option value="substitute">替代方案</option></select></label>
                  <label><span>官网或资料链接</span><input value={item.url} maxLength={300} onChange={(event) => update(index, 'url', event.target.value)} placeholder="https://" /></label>
                  <label><span>已知信息或观察</span><textarea value={item.notes} maxLength={1200} onChange={(event) => update(index, 'notes', event.target.value)} placeholder="目标用户、功能、价格、体验、AI 能力等。越具体，结论越可靠。" /></label>
                </article>
              ))}
            </div>
            <div className="goal-panel"><label><span>本次分析目的 *</span><select value={goal} onChange={(event) => setGoal(event.target.value)}>{goals.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><p>分析目的会改变建议侧重点。Demo 固定比较三个竞品，适合快速验证研究方向。</p></div>
            <div className="disclosure"><strong>模型增强已开启</strong><p>使用作品集服务端的豆包模型。资料不会保存在本站，但会发送给火山方舟生成报告，请勿输入个人隐私或商业机密。</p></div>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="primary" type="submit" disabled={loading}>{loading ? '正在构建竞争地图…' : '开始分析 →'}</button>
          </form>
        </section>
        {result && <Results result={result} />}
      </main>
      <footer>竞品雷达 Demo · 用于验证产品流程，不替代正式竞品调研</footer>
    </>
  );
}

function Results({ result }: { result: Analysis }) {
  return (
    <section className="results" id="results">
      <div className="section-head"><div><p>STEP 02</p><h2>分析结果</h2></div><a href="#top">重新分析</a></div>
      <div className="meta"><span className="active">{result.mode}</span><span>生成于 {result.generatedAt}</span><span>{result.dataBasis}</span></div>
      <div className="summary-grid">{result.competitorSummaries.map((item, index) => <article key={item.name}><small>COMPETITOR 0{index + 1}</small><h3>{item.name}</h3><p>{item.summary}</p><div><b>{item.relation}</b><span>{item.confidence}</span></div></article>)}</div>
      <ReportTitle index="01" title="关键结论" caption="回答共同缺口、机会点和差异化切入三个问题。" />
      <div className="conclusion-grid">{result.conclusions.map((item) => <article key={item.label}><small>{item.label}</small><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
      <ReportTitle index="02" title="七维对比矩阵" caption="强弱判断仅基于本次输入，每个单元格均保留判断依据。" />
      <div className="table-wrap"><table><thead><tr><th>分析维度</th>{result.competitorSummaries.map((item) => <th key={item.name}>{item.name}</th>)}</tr></thead><tbody>{result.dimensionRows.map((row) => <tr key={row.dimension}><td>{row.dimension}</td>{row.values.map((value, index) => <td key={row.dimension + index}><b className={"rating " + value.level}>{value.rating}</b><p>{value.evidence}</p></td>)}</tr>)}</tbody></table></div>
      <ReportTitle index="03" title="产品建议" caption="每条建议包含判断依据和可立即执行的验证动作。" />
      <div className="recommendations">{result.recommendations.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{item.title}</h4><p>{item.rationale}</p></div><b>下一步：{item.action}</b></article>)}</div>
      <ReportTitle index="04" title="待核验清单" caption="把推断转成事实前，优先补齐这些证据。" />
      <div className="verification">{result.verificationTasks.map((task) => <div key={task}>{task}</div>)}</div>
    </section>
  );
}

function ReportTitle({ index, title, caption }: { index: string; title: string; caption: string }) {
  return <div className="report-title"><span>{index}</span><div><h3>{title}</h3><p>{caption}</p></div></div>;
}
