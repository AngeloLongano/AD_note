from pathlib import Path
import math, re, json, html, base64
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import toColor as HexColor

OUT=Path(__file__).resolve().parents[1]
W,H=841.889764,595.275591
FONT=str(OUT/'fonts')+'/'
pdfmetrics.registerFont(TTFont('Body',FONT+'DejaVuSansCondensed.ttf'))
pdfmetrics.registerFont(TTFont('Bold',FONT+'DejaVuSansCondensed-Bold.ttf'))
FONT_CSS='<style>'+''.join('@font-face{font-family:CookbookSans;font-weight:'+str(weight)+';src:url(data:font/ttf;base64,'+base64.b64encode(Path(FONT+fn).read_bytes()).decode()+') format("truetype");}' for weight,fn in [(400,'DejaVuSansCondensed.ttf'),(700,'DejaVuSansCondensed-Bold.ttf')])+'</style>'
C={'ink':'#172B3A','muted':'#536674','line':'#CDD6DC','blue':'#175C8D','orange':'#A44914','green':'#20664C','purple':'#674399','red':'#A23840','bg':'#FFFFFF','pale':'#F2F6F8'}
COLORS={'Specifica':'blue','Modello':'blue','Idea':'orange','Passi':'orange','Passo':'orange','Prova':'green','Invariante':'green','Correttezza':'green','Termina':'green','Costo':'purple','Tempo':'purple','Messaggi':'purple','Spazio':'purple','Limite':'red','Status':'red','Attenzione':'red','Ipotesi':'blue','Definizione':'blue','Teorema':'blue','Esempio':'muted','Ricorda':'muted','Nota':'muted'}
PAGES=[]; CHECKS=[]

def p(label,text): return ('p',label,text)
def formula(s): return ('formula',s)
def diagram(kind,**kw): return ('diagram',kind,kw)
def sec(title,*blocks,tag=None): return {'title':title,'blocks':blocks,'tag':tag}
def page(title,sub,cols,refs): PAGES.append(dict(title=title,sub=sub,cols=cols,refs=refs))

def width(s,size=10,font='Body'): return pdfmetrics.stringWidth(s,font,size)
def wrap_runs(runs,w,size=10):
 lines=[]; line=[]; used=0
 for txt,font,col in runs:
  for word in re.findall(r'\S+\s*',txt):
   word=word.rstrip()+' '
   ww=width(word,size,font)
   if used+ww>w and line:
    lines.append(line);line=[];used=0
   if ww>w: raise ValueError('word too wide '+word)
   line.append((word,font,col));used+=ww
 if line:lines.append(line)
 return lines

class Draw:
 def __init__(self,cv): self.cv=cv;self.e=[];self.extents=[]
 def rect(self,x,y,w,h,fill='white',stroke=None,r=0):
  self.e.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="0.65"' if stroke else '')+'/>')
  c=self.cv;c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.setLineWidth(.65)
  c.roundRect(x,H-y-h,w,h,r,stroke=int(bool(stroke)),fill=1)
 def line(self,x1,y1,x2,y2,color=None,sw=1,dash=False):
  color=color or C['line'];self.e.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{color}" stroke-width="{sw}"'+(' stroke-dasharray="3 3"' if dash else '')+'/>')
  c=self.cv;c.setStrokeColor(HexColor(color));c.setLineWidth(sw);c.setDash([3,3] if dash else []);c.line(x1,H-y1,x2,H-y2);c.setDash([])
 def text(self,x,y,s,size=10,font='Body',color=None,anchor='start'):
  color=color or C['ink'];ww=width(s,size,font)
  xx=x-ww/2 if anchor=='middle' else x-ww if anchor=='end' else x
  self.extents.append((xx,y-size,xx+ww,y+size*.24,s))
  self.e.append(f'<text x="{x:.2f}" y="{y:.2f}" font-family="'+'CookbookSans, DejaVu Sans Condensed, DejaVu Sans, sans-serif'+f'" font-size="{size}"'+(' font-weight="700"' if font=='Bold' else '')+f' fill="{color}" text-anchor="{anchor}" xml:space="preserve" style="font-kerning:none">{html.escape(s)}</text>')
  self.cv.setFillColor(HexColor(color));self.cv.setFont(font,size);self.cv.drawString(xx,H-y,s)
 def circle(self,x,y,r,fill='white',stroke=None,sw=1):
  stroke=stroke or C['blue'];self.e.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
  self.cv.setFillColor(HexColor(fill));self.cv.setStrokeColor(HexColor(stroke));self.cv.setLineWidth(sw);self.cv.circle(x,H-y,r,stroke=1,fill=1)
 def arrow(self,x1,y1,x2,y2,color=None,sw=1.3):
  color=color or C['orange'];self.line(x1,y1,x2,y2,color,sw)
  a=math.atan2(y2-y1,x2-x1);L=5
  for d in [-.48,.48]: self.line(x2,y2,x2-L*math.cos(a+d),y2-L*math.sin(a+d),color,sw)
 def node(self,x,y,label,selected=False,r=9):
  self.circle(x,y,r,C['blue'] if selected else 'white');self.text(x,y+3,label,8.5,color='white' if selected else C['blue'],anchor='middle')

def diag_height(kind): return {'flow':56,'star':82,'matching':71,'tree':86,'ring':97,'hs':86,'quorum':76,'chord':160,'yoyo':92,'timeline':69,'triangle':72,'branch':85}.get(kind,60)
def draw_diag(d,kind,x,y,w,kw):
 h=diag_height(kind)
 if kind=='flow':
  labels=kw['labels'];bw=(w-16*(len(labels)-1))/len(labels)
  for i,s in enumerate(labels):
   xx=x+i*(bw+16);d.rect(xx,y+5,bw,29,C['pale'],C['line'],4)
   ss=s.split('\n')
   for j,t in enumerate(ss):d.text(xx+bw/2,y+17+j*10,t,8.5,anchor='middle')
   if i<len(labels)-1:d.arrow(xx+bw+2,y+20,xx+bw+14,y+20)
  if kw.get('caption'):d.text(x+w/2,y+49,kw['caption'],8.4,color=C['muted'],anchor='middle')
 elif kind=='star':
  cx=x+43;cy=y+37
  for a in [-math.pi/2,0,math.pi/2,math.pi]:
   xx=cx+27*math.cos(a);yy=cy+27*math.sin(a);d.line(cx,cy,xx,yy,C['blue']);d.node(xx,yy,'',r=5)
  d.node(cx,cy,'c',True,r=8)
  d.text(x+88,y+22,'Stella: OPT = {c}',10,font='Bold')
  d.text(x+88,y+39,'foglie: costo n−1',9.7)
  d.text(x+88,y+56,'un arco: 2 estremi',9.7)
 elif kind=='matching':
  for i in range(3):
   xx=x+18+i*72;d.line(xx,y+17,xx+40,y+17,C['green'],2.5);d.node(xx,y+17,'',True,r=5);d.node(xx+40,y+17,'',True,r=5)
  d.text(x+w/2,y+44,'E′: archi senza estremi in comune',9.6,anchor='middle')
  d.text(x+w/2,y+60,'OPT ≥ 3 vertici; C ne sceglie 6',9.6,anchor='middle')
 elif kind=='triangle':
  a=(x+20,y+50);b=(x+w/2,y+10);c=(x+w-20,y+50)
  d.line(*a,*b,C['line']);d.line(*b,*c,C['line']);d.arrow(a[0]+9,a[1],c[0]-9,c[1],C['green'])
  for pt,l in [(a,'u'),(b,'v'),(c,'w')]:d.node(*pt,l,r=7)
  d.text(x+w/2,y+66,'c(u,w) ≤ c(u,v) + c(v,w)',9.5,anchor='middle')
 elif kind=='tree':
  pts=[(x+20,y+17),(x+20,y+63),(x+75,y+40),(x+w-75,y+40),(x+w-20,y+17),(x+w-20,y+63)]
  for a,b in [(0,2),(1,2),(4,3),(5,3)]:
   pa,pb=pts[a],pts[b];dx=pb[0]-pa[0];dy=pb[1]-pa[1];le=math.hypot(dx,dy)
   d.arrow(pa[0]+dx/le*8,pa[1]+dy/le*8,pb[0]-dx/le*8,pb[1]-dy/le*8,C['green'])
  d.arrow(pts[2][0]+10,pts[2][1]-4,pts[3][0]-10,pts[3][1]-4,C['green'])
  d.arrow(pts[3][0]-10,pts[3][1]+4,pts[2][0]+10,pts[2][1]+4,C['green'])
  for i,(xx,yy) in enumerate(pts):d.node(xx,yy,'a' if i==2 else 'b' if i==3 else '',i in [2,3],7)
  d.text(x+w/2,y+81,'due parti → una coppia adiacente',9.3,anchor='middle')
 elif kind=='ring':
  cx=x+52;cy=y+44;R=32;labs=kw.get('labels',['1','2','3','4','5'])
  pts=[(cx+R*math.cos(-math.pi/2+i*2*math.pi/len(labs)),cy+R*math.sin(-math.pi/2+i*2*math.pi/len(labs))) for i in range(len(labs))]
  for i,a in enumerate(pts):
   b=pts[(i+1)%len(pts)];dx=b[0]-a[0];dy=b[1]-a[1];le=math.hypot(dx,dy);d.arrow(a[0]+dx/le*9,a[1]+dy/le*9,b[0]-dx/le*9,b[1]-dy/le*9,C['orange'])
  for i,pt in enumerate(pts):d.node(*pt,labs[i],labs[i]=='1',r=8)
  for i,t in enumerate(kw.get('notes',[])):d.text(x+104,y+24+i*16,t,9.5)
 elif kind=='hs':
  for i in range(7):
   xx=x+12+i*(w-24)/6
   if i<6:d.line(xx,y+38,xx+(w-24)/6,y+38,C['line'])
   d.node(xx,y+38,'x' if i==3 else '',i==3,r=5)
  cx=x+w/2
  d.arrow(cx-8,y+16,x+12,y+16);d.arrow(cx+8,y+16,x+w-12,y+16)
  d.text(cx,y+9,'Forth: raggio 2ⁱ per lato',9.2,anchor='middle')
  d.text(cx,y+66,'superstiti distanti ≥ 2ⁱ⁻¹ + 1',9.8,anchor='middle')
 elif kind=='quorum':
  for i in range(7):
   xx=x+13+i*(w-26)/6;d.node(xx,y+23,str(i+1),i==2,r=8)
  middle=x+13+2*(w-26)/6
  d.line(x+5,y+5,middle+8,y+5,C['green'],3);d.line(middle-8,y+41,x+w-5,y+41,C['purple'],3)
  d.text(x+w/2,y+64,kw.get('caption','|S| + |T| > n ⇒ S ∩ T ≠ ∅'),10,anchor='middle')
 elif kind=='yoyo':
  pts=[(x+25,y+20),(x+25,y+68),(x+w/2,y+44),(x+w-25,y+44)]
  for a,b in [(0,2),(1,2),(2,3)]:d.arrow(pts[a][0]+9,pts[a][1],pts[b][0]-9,pts[b][1],C['orange'])
  for i,pt in enumerate(pts):d.node(*pt,['2','7','12','20'][i],i==0)
  d.text(x+w/2,y+9,'YO: minimo verso i sink',9.3,anchor='middle')
  d.text(x+w/2,y+87,'−YO: voti indietro; NO ⇒ flip',9.3,anchor='middle')
 elif kind=='timeline':
  d.line(x+8,y+25,x+w-8,y+25,C['line'],2)
  for i,s in enumerate(kw['labels']):
   xx=x+12+i*(w-24)/(len(kw['labels'])-1);d.circle(xx,y+25,3,C['orange'],C['orange']);d.text(xx,y+12,s,9.2,anchor='middle')
  d.text(x+w/2,y+51,kw.get('caption',''),9.3,anchor='middle')
 elif kind=='branch':
  d.rect(x+w/2-27,y,54,20,C['pale'],C['line'],3);d.text(x+w/2,y+14,'UB = 12',9.5,anchor='middle')
  for i,(t,col) in enumerate([('LB=7','green'),('LB=12','red'),('LB=15','red')]):
   xx=x+12+i*(w-24)/3;d.arrow(x+w/2,y+21,xx+29,y+41,C[col]);d.rect(xx,y+42,58,20,'white',C[col],3);d.text(xx+29,y+56,t,9.5,anchor='middle')
   d.text(xx+29,y+79,'esplora' if i==0 else 'pota',9.4,anchor='middle')
 elif kind=='chord':
  cx=x+w/2;cy=y+77;R=54;ids=[4,8,15,20,32,35,44,54]
  pts={i:(cx+R*math.sin(.3+j/8*2*math.pi),cy-R*math.cos(.3+j/8*2*math.pi)) for j,i in enumerate(ids)}
  d.circle(cx,cy,R,'white',C['line'])
  for i,pt in pts.items():d.node(*pt,str(i),i==44,r=9)
  for a,b in [(8,32),(32,35),(35,44)]:
   pa,pb=pts[a],pts[b];dx=pb[0]-pa[0];dy=pb[1]-pa[1];le=math.hypot(dx,dy);d.arrow(pa[0]+dx/le*10,pa[1]+dy/le*10,pb[0]-dx/le*10,pb[1]-dy/le*10,C['orange'],1.8)
  d.text(cx,y+9,'ID 0 … 63 · posizioni schematiche',9.5,anchor='middle');d.text(cx,y+155,'con finger: lookup(37), 8 → 32 → 35 → 44',9.5,anchor='middle')
 return h

FS=10.15; LEAD=13.0

def card_layout(s,w):
 rows=[];y=36
 if s['tag']:
  rows.append(('tag',y,s['tag']));y+=17
 for b in s['blocks']:
  if b[0]=='p':
   _,lab,tx=b;col=C[COLORS.get(lab,'muted')]
   runs=([(lab+'. ','Bold',col)] if lab else [])+[(tx,'Body',C['ink'])]
   for line in wrap_runs(runs,w-22,FS): rows.append(('text',y,line));y+=LEAD
   y+=5
  elif b[0]=='formula':
   fsize=11.0
   if width(b[1],fsize)>w-22: fsize=10.1
   if width(b[1],fsize)>w-22: raise ValueError('formula too wide '+b[1])
   rows.append(('formula',y,b[1],fsize));y+=20
  else:
   rows.append(('diagram',y-4,b[1],b[2]));y+=diag_height(b[1])+3
 return y+1,rows

def draw_card(d,x,y,w,s):
 h,rows=card_layout(s,w)
 extent_start=len(d.extents)
 d.rect(x,y,w,h,'white',C['line'],5)
 d.line(x+11,y+23,x+w-11,y+23,C['line'],.6)
 if width(s['title'],12.6,'Bold')>w-22:raise ValueError('title too wide '+s['title'])
 d.text(x+11,y+18,s['title'],12.6,'Bold')
 for row in rows:
  typ,yy=row[:2]; yy+=y
  if typ=='tag':d.text(x+11,yy,row[2],9.0,'Bold',C['red'])
  elif typ=='text':
   xx=x+11
   merged=[]
   for tx,ft,col in row[2]:
    if merged and merged[-1][1:]==(ft,col):merged[-1]=(merged[-1][0]+tx,ft,col)
    else:merged.append((tx,ft,col))
   for tx,ft,col in merged:d.text(xx,yy,tx,FS,ft,col);xx+=width(tx,FS,ft)
  elif typ=='formula':d.text(x+w/2,yy,row[2],row[3],color=C['purple'],anchor='middle')
  else:draw_diag(d,row[2],x+11,yy,w-22,row[3])
 for xx1,yy1,xx2,yy2,tx in d.extents[extent_start:]:
  if xx1 < x+5 or xx2 > x+w-5 or yy1 < y+2 or yy2 > y+h-2:
   raise ValueError(f'Content outside card {s["title"]}: {tx} {xx1,yy1,xx2,yy2}')
 return h

# CONTENT BELOW
page('01  Fondamenti e complessità','Dal problema alla prova di difficoltà • Le frecce indicano trasformazioni o implicazioni, secondo l’etichetta.',[
 [sec('Problema → algoritmo → costo',
  p('Definizione','Un problema specifica input e output; un’istanza assegna valori concreti ai parametri. Un algoritmo corretto termina e restituisce l’output richiesto su ogni istanza.'),
  p('Specifica','Decisione: sì/no. Ricerca: una soluzione ammissibile. Ottimizzazione: una soluzione di costo minimo o massimo.'),
  p('Esempio','Cammini: “esiste un cammino s→v di costo ≤ k?” / “trovalo” / “trova quello di costo minimo”.'),
  p('Costo','Dimensione N: bit dell’input (costo logaritmico) oppure elementi (costo uniforme). Tempo: operazioni; spazio: celle. Dichiarare modello e caso peggiore, medio o atteso.'),
  p('Attenzione','Un intero K richiede Θ(log(K+1)) bit: un costo O(K) può essere esponenziale nella lunghezza della sua codifica.')),
  sec('Notazione asintotica',
  p('Definizione','Per funzioni non negative, per ogni N ≥ N₀ e opportune costanti positive:'),
  formula('O(g): f(N) ≤ c g(N)'),formula('Ω(g): f(N) ≥ c g(N)'),formula('Θ(g): c₁g(N) ≤ f(N) ≤ c₂g(N)'),
  p('Ricorda','O è un limite superiore, non un’uguaglianza. Un upper bound di un algoritmo dà un upper bound del problema; un lower bound del problema vale per ogni algoritmo.'))],
 [sec('P, NP e certificati',
  p('Definizione','P: problemi decisionali risolvibili in tempo polinomiale. NP: problemi decisionali con certificati positivi di lunghezza polinomiale verificabili in tempo polinomiale.'),
  p('Prova','Istanza sì ⇒ esiste un certificato accettato. Istanza no ⇒ nessun certificato è accettato. Il verificatore riceve istanza e certificato, non deve cercare il certificato.'),
  p('Esempio','HC: istanza = grafo; certificato = ordine dei vertici. Controlla che compaiano tutti una sola volta e che ogni coppia consecutiva, inclusa l’ultima con la prima, sia un arco.'),
  formula('P ⊆ NP • P = NP è aperto'),
  p('Prova','Per P basta eseguire il risolutore ignorando il certificato. Questo non dimostra NP ⊆ P. SAT è NP-completo (Cook–Levin); un assegnamento è il suo certificato.')),
  sec('Quanto cresce il costo?',
  p('Ricorda','1, log log N, log N, radici, N, N log N, N², N³, Nᵏ: limitati da un polinomio per k costante. aᴺ (a>1) e N! sono superpolinomiali.'),
  p('Nota','“Polinomiale” non significa necessariamente “un polinomio”. La tesi estesa di Church–Turing motiva la stabilità della classe sui modelli classici ragionevoli.'),
  p('Limite','NP-hard non significa irrisolvibile. Il problema della fermata è invece indecidibile: non ammette un algoritmo generale.'))],
 [sec('Come dimostrare NP-completezza',
  p('Definizione','Karp A ≤ₚ B: trasformazione polinomiale f con x sì per A ⇔ f(x) sì per B. Conservare entrambi i versi.'),
  diagram('flow',labels=['istanza A','f in tempo\npolinomiale','istanza B'],caption='B facile ⇒ A facile'),
  p('Passi','Per provare B NP-completo: 1) B ∈ NP; 2) scegli A NP-completo noto; 3) dimostra A ≤ₚ B. La transitività trasferisce la difficoltà verso B.'),
  p('Definizione','NP-hard: ogni problema in NP si riduce a B; non si richiede B ∈ NP. Per ricerca/ottimizzazione precisare la riduzione con oracolo (Turing), anche con più chiamate adattive.'),
  p('Teorema','Un solo NP-completo in P ⇒ P = NP. La NP-hardness è incondizionata; “nessun algoritmo polinomiale” richiede l’ipotesi P ≠ NP.')),
  sec('Approssimare con una garanzia',
  p('Definizione','Algoritmo polinomiale, output ammissibile; fattore ρ ≥ 1. ALG e OPT sono i costi.'),
  formula('min: OPT ≤ ALG ≤ ρ OPT'),formula('max: ALG ≤ OPT ≤ ρ ALG'),
  p('Prova','Per minimo: trova LB ≤ OPT e dimostra ALG ≤ ρ LB. Se OPT=0 la garanzia impone ALG=0; evita rapporti con denominatore nullo.'))]
], 'I pp. 2–20; C pp. 2–23; A §§1, 2.1–2.2 • Legenda: blu specifica/ipotesi; arancio passi; verde prova; viola costi; rosso limiti/status.')

page('02  TSP: ridurre, approssimare, dimostrare','Grafo semplice non diretto • n = |V| ≥ 3 • H* = tour ottimo; cost = somma dei pesi, con molteplicità.',[
 [sec('HC usando il TSP esatto',
  p('Specifica','G=(V,E) → sì se esiste un ciclo hamiltoniano. Usa un oracolo TSP: grafo completo pesato → tour di costo minimo.'),
  p('Passi','Completa G sugli stessi vertici. Poni c(e)=0 per e∈E, c(e)=1 per gli archi aggiunti. Chiedi il tour ottimo di costo K; rispondi sì ⇔ K=0.'),
  diagram('flow',labels=['HC: G','TSP esatto\ncosti 0/1','K = 0?'],caption='HC ≤ᵖ_T TSP ottimizzazione'),
  p('Prova','Un HC di G usa solo archi a costo 0. Viceversa, un tour a costo 0 usa solo archi di G. Quindi TSP è NP-hard.'),
  p('Costo','O(n²) tempo e spazio esterni all’oracolo (matrice); una chiamata. Non è il costo del risolutore TSP.')),
  sec('TSP generale: nessun ρ costante',
  p('Ipotesi','Costi positivi; nessuna triangolare. Supponi un’approssimazione polinomiale di fattore costante r ≥ 1.'),
  p('Passi','Da HC costruisci costi 1 sugli archi originali e r|V|+1 sugli altri.'),
  p('Prova','Caso sì: OPT=|V| ⇒ ALG ≤ r|V|. Caso no: ogni tour usa un arco aggiunto ⇒ ALG ≥ r|V|+1+|V|−1 > r|V|.'),
  p('Teorema','La soglia r|V| deciderebbe HC in tempo polinomiale ⇒ P=NP. Dunque nessun fattore costante, a meno che P=NP.') )],
 [sec('TSP metrico: strumenti comuni',
  p('Modello','G completo, non diretto, pesi positivi e disuguaglianza triangolare. Output: tour ammissibile vicino all’ottimo.'),
  diagram('triangle'),
  p('Prova','Shortcut: per induzione, il costo dell’arco diretto è ≤ somma dei costi del cammino sostituito. Completezza ⇒ l’arco esiste.'),
  p('Ricorda','Un ciclo euleriano usa ogni arco una volta; un tour hamiltoniano ogni vertice una volta. Un multigrafo connesso con tutti i gradi pari ammette un ciclo euleriano.'),
  p('Prova','MST T*: togliendo un arco da H* resta uno spanning tree; per minimalità, cost(T*) ≤ cost(H*).')),
  sec('2-approssimazione',
  p('Passi','MST T → raddoppia gli archi → ciclo euleriano → shortcut dei vertici già visitati → tour H.'),
  p('Prova','Raddoppiare rende i gradi pari e preserva la connessione. Gli shortcut non aumentano il costo.'),
  formula('cost(H) ≤ 2cost(T) ≤ 2cost(H*)'),
  p('Costo','Tempo polinomiale: MST, visita e shortcut. Con matrice e Prim semplice: O(n²); memoria O(n²) includendo l’input.'),
  tag='FACOLTATIVO • non svolto AA 25/26')],
 [sec('Christofides: fattore 3/2',
  p('Specifica','Stesso input metrico → tour H con cost(H) ≤ (3/2)cost(H*).'),
  p('Passi','1. Calcola MST T*. 2. V_d = vertici di grado dispari in T*. 3. Sul completo indotto G_d calcola un matching perfetto M* di peso minimo.'),
  p('Passi','4. G′ = T* più M*, mantenendo eventuali archi paralleli. 5. Trova un ciclo euleriano. 6. Usa shortcut e chiudi il tour H.'),
  diagram('flow',labels=['MST T*','dispari V_d\n+ matching','Euleriano\n→ tour'],caption='si corregge soltanto la parità dispari'),
  p('Prova','La somma dei gradi è pari ⇒ |V_d| è pari. G_d completo ⇒ esiste un matching perfetto. Aggiungendolo, ogni dispari diventa pari; G′ resta connesso.'),
  p('Prova','Da H* salta i vertici fuori da V_d: ottieni Γ con cost(Γ) ≤ cost(H*). Gli archi alternati di Γ formano due matching perfetti; il più economico costa ≤ cost(Γ)/2.'),
  formula('cost(M*) ≤ cost(H*)/2'),
  p('Nota','Se |V_d|=2, Γ percorre due volte lo stesso arco: le due occorrenze formano i due matching.'),
  formula('cost(H) ≤ cost(T*) + cost(M*)'),
  formula('≤ cost(H*) + cost(H*)/2'),
  p('Costo','Tempo polinomiale, incluso il matching perfetto minimo. L’esponente dipende dall’implementazione; le dispense richiedono la polinomialità.'),
  p('Attenzione','Il matching deve essere di peso minimo. Il TSP metrico resta NP-hard: costi 1/2 (uno o due) nella riduzione HC soddisfano la triangolare; soglia n. Questo non contraddice il fattore 3/2.'))]
], 'C pp. 24–26, 68–74; A “TSP è NP-hard”, “TSP metrico”; correzioni M04–M05 e B04–B05. Costi di Prim: implementazione esplicitata.')

page('03  Vertex Cover e ricerca esatta','G=(V,E) non diretto • n=|V|, m=|E| • Un cover contiene almeno un estremo di ogni arco.',[
 [sec('VC: tre scelte greedy',
  p('Specifica','G → cover C piccolo; VC cerca quello minimo. VCD(G,k) chiede se esiste un cover di taglia ≤ k.'),
  p('Prova','VCD è NP-completo. Un oracolo VC dà il minimo V′; confronta |V′| con k ⇒ VCD ≤ᵖ_T VC, quindi VC è NP-hard.'),
  p('Passi','Vertice arbitrario: scegli v, aggiungilo a C, elimina gli archi incidenti. Termina quando non restano archi. Tempo O(n+m), ma nessun fattore costante.'),
  diagram('star'),
  p('Passi','Grado massimo: scegli ogni volta il vertice col maggior grado residuo. Tempo polinomiale; sistema la stella ma non garantisce un fattore costante (dispense p. 59).'),
  p('Passi','Arco arbitrario: scegli (u,v), aggiungi entrambi a C, elimina tutti gli archi incidenti. Gli archi scelti E′ sono un matching massimale.'),
  diagram('matching'),
  p('Prova','Ogni cover deve usare un estremo distinto per ciascun arco di E′. Dunque |OPT| ≥ |E′| e |C|=2|E′| ≤ 2|OPT|.'),
  p('Costo','O(n+m) tempo con liste; O(n+m) spazio includendo il grafo. La stella dà rapporto 2: il bound è tight.'))],
 [sec('Relax & Round: fattore 2',
  p('Specifica','G → cover rappresentato dal vettore binario X=APPROX. Cost(X)=Σᵥ xᵥ.'),
  formula('min Σᵥ xᵥ; xᵤ+xᵥ ≥ 1 ∀(u,v)∈E'),
  p('Passi','ILP: xᵥ∈{0,1}. Rilassa a 0≤xᵥ≤1 e risolvi l’LP, ottenendo X*. Arrotonda xᵥ=1 se x*ᵥ≥1/2, altrimenti 0.'),
  p('Prova','Su ogni arco almeno un x* è ≥1/2 ⇒ l’arco è coperto. Ogni soluzione intera è ammessa nell’LP ⇒ Cost(X*)≤Cost(OPT). Inoltre xᵥ≤2x*ᵥ.'),
  formula('Cost(X) ≤ 2Cost(X*) ≤ 2Cost(OPT)'),
  p('Costo','LP polinomiale; n variabili, O(n+m) vincoli; rounding O(n). Su ciclo pari, se l’LP restituisce tutti 1/2, selezioni n vertici contro n/2 ottimi: rapporto 2.'),
  p('Status','VC pesato: NON D’ESAME AA 25/26. L’estensione usa Σᵥ wᵥxᵥ e lo stesso rounding.')),
  sec('Self-reduction con oracolo VCD',
  p('Passi','Ricerca binaria su [0,n] trova k ottimo. Poi, sul grafo corrente, prova A(G−v,k−1). Se sì: seleziona v, rimuovilo e decrementa k. Se no: lascia il grafo invariato e passa oltre.'),
  p('Prova','Resta sempre un cover compatibile col budget residuo. A fine archi, le scelte formano un cover ottimo.'),
  p('Costo','O(log n+n) chiamate adattive; lavoro esterno polinomiale. Non rende VCD polinomiale.'),
  tag='FACOLTATIVO • C pp. 56–57')],
 [sec('Branch & Bound: minimo esatto',
  p('Specifica','Spazio finito di soluzioni → soluzione ammissibile di costo minimo. UB = costo della migliore già trovata; LB(S) ≤ costo di ogni soluzione del ramo S.'),
  p('Passi','Se S è vuoto o LB(S)≥UB: pota. Se S è una soluzione: valuta e aggiorna UB. Altrimenti genera figli che coprono S e richiama ricorsivamente.'),
  diagram('branch'),
  p('Prova','Il pruning non elimina miglioramenti. I figli coprono tutte le possibilità; una misura finita deve diminuire. Esauriti i rami, UB è ottimo.'),
  p('Costo','Il singolo bound può essere polinomiale, ma l’intera ricerca può essere esponenziale. Se ti fermi: LB_glob=min(UB, bound dei rami aperti), LB_glob≤OPT≤UB.'),
  tag='FACOLTATIVO • indicazione utente'),
  sec('TSP: lower bound con 1-tree',
  p('Passi','Nel sottografo corrente G′ scegli v: MST su V−{v}, più i due archi distinti più economici incidenti a v. La somma dei costi è LB.'),
  p('Prova','Ogni tour meno v è uno spanning tree; i suoi due archi su v non costano meno dei due scelti. Se il 1-tree è un tour, è ottimo nel ramo.'),
  p('Passi','Altrimenti scegli w di grado ≥3 nel 1-tree. Per ogni arco di G′ incidente a w crea un figlio che lo elimina. Ogni tour omette almeno un arco: resta in un figlio.'),
  p('Costo','Bound e figli polinomiali per nodo; figli anche sovrapposti. Se mancano MST o due archi su v, ramo vuoto.'))]
], 'C pp. 55–60, 63–67, 97–104; A “Vertex Cover”, “Branch and bound”; M06/C02, B06–B07. Refusi corretti: C pp. 57, 60, 66.')
page('04  Diffondere e costruire uno spanning tree','n=|V|, m=|E|; d(u,v)=distanza in archi; r(s)=maxᵥd(s,v); D=maxₛr(s). N(x)=vicini di x.',[
 [sec('Il modello viene prima del bound',
  p('Modello','Entità con stato e memoria locale; messaggi tra vicini, porte distinguibili. Ritardi finiti in assenza di guasti. Sincronia, FIFO, ID e conoscenza di n sono restrizioni aggiuntive.'),
  p('Costo','M = invii, B = bit trasmessi. Tᵢ = tempo ideale: una trasmissione per unità; T_c = massima catena causale. In asincrono non c’è un bound uniforme sul tempo fisico senza limiti ai ritardi.'),
  p('Ipotesi','In questa pagina: BL = link bidirezionali, CN = grafo connesso, TR = nessun guasto. Un iniziatore, tranne WFlood. Ogni nodo conosce i propri vicini.')),
  sec('Flooding / Broadcast',
  p('Specifica','Solo s conosce I → tutti apprendono I. s invia a tutti; alla prima ricezione, inoltra a tutti tranne il mittente e passa a DONE. Ignora le copie successive.'),
  p('Prova','Un nodo raggiunto deve inviare oltre ogni frontiera verso un nodo non raggiunto. Connessione e consegna finita ⇒ tutti raggiunti. Un solo inoltro per nodo ⇒ termina.'),
  formula('M = 2m − n + 1; Tᵢ = r(s)'),
  p('Limite','DONE è locale, non rileva la fine globale. T_c≤n−1 fino alle prime ricezioni; ≤n includendo copie ridondanti.'),
  p('Ricorda','Su albero M=n−1. Su completo noto: simple broadcast diretto, M=n−1 e Tᵢ=1.'))],
 [sec('WFlood / Wake-up',
  p('Specifica','Almeno un risveglio spontaneo → tutti AWAKE. Sveglio spontaneamente: invia W a tutti. Sveglio su W: inoltra tranne al mittente. Dopo, ignora ogni W.'),
  p('Prova','Stessa frontiera del Flooding. k conta chi si sveglia spontaneamente prima di ricevere W; gli altri n−k risparmiano un invio.'),
  formula('M = 2m − (n−k), 1 ≤ k ≤ n'),
  p('Tempo','Dal primo iniziatore Tᵢ≤D. Con iniziatori S simultanei: Tᵢ=maxᵥ minₛ∈S d(s,v). Terminazione locale, non rilevazione globale.')),
  sec('SHOUT e SHOUT+',
  p('Specifica','G → ogni nodo conosce TreeNeighbours; i due estremi concordano sugli archi dell’albero.'),
  p('Passi','SHOUT: s invia Q. Alla prima Q scegli parent, rispondi YES e invia Q agli altri. Alle successive Q rispondi NO. Attendi una risposta per ogni vicino.'),
  p('Modello','FIFO per la versione con NO e contatore: evita che un NO superi una Q e faccia terminare troppo presto.'),
  p('Prova','Un parent scelto alla prima scoperta precede il figlio; i parent risalgono a s senza cicli. Connettività ⇒ copertura. Gli YES identificano anche i figli.'),
  formula('SHOUT: M = 4m−2n+2'),
  p('Tempo','Per n≥2, fino al DONE di tutti: r(s)+1 ≤ Tᵢ ≤ r(s)+2.'),
  p('Passi','SHOUT+: elimina NO; una Q incrociata conta come rifiuto implicito. Ogni arco porta Q/YES oppure Q/Q.'),
  formula('SHOUT+: M = 2m; Tᵢ = r(s)+1'))],
 [sec('DFT: un token alla volta',
  p('Specifica','G → spanning tree di visita in profondità. Un solo token; non richiede FIFO.'),
  p('Passi','ForwardToken prova un vicino non visitato. Alla prima visita memorizza parent; esplora un vicino alla volta aspettando il ritorno. ReturnToken chiude il sottoalbero; BackEdgeToken rifiuta un arco verso un visitato.'),
  p('Prova','Un parent per nodo; Unvisited diminuisce. Ogni arco è classificato; quando il token torna e s esaurisce i vicini, s rileva la fine globale.'),
  formula('M = 2m; T_c = Tᵢ = 2m'),
  p('Ricorda','Ogni arco: Forward/Return oppure Forward/BackEdge. SHOUT può essere BFS solo con arrivi ideali per livelli; DFT può produrre grande diametro.')),
  sec('DFT con Visited / Ack',
  p('Passi','Alla prima visita invia Visited ai vicini tranne parent; attendi gli Ack prima di muovere il token. Chi riceve Visited rimuove il mittente dai vicini da esplorare.'),
  p('Prova','Il token evita le back-edge; gli handshake con vicini diversi sono paralleli. Il token percorre soltanto i n−1 archi dell’albero, andata e ritorno.'),
  formula('M ≤ 4m; Tᵢ ≤ 4n−2 = O(n)'),
  p('Costo','Tempo: 2(n−1) token + al più 2n di handshake sul cammino critico. Il termine 2n non conta tutti gli invii.'),
  p('Limite','Più iniziatori indipendenti possono produrre una foresta. Per un albero unico: eleggi prima il leader oppure coordina costruzioni con ID.'),
  p('Nota','n=1: nessun messaggio per tutti questi protocolli.'))]
], 'D pp. 22–36, 37–68, 71–109; A §§Broadcast, Wake-up, SHOUT, DFT; M07–M09, B08–B10. Memoria locale: O(deg(x)) per i vicini dell’albero.')

page('05  Alberi e anelli: eleggere un leader','Leader election: esattamente un leader, tutti gli altri follower • Link affidabili, porte locali, ID distinti salvo il limite anonimo.',[
 [sec('Saturazione su alberi',
  p('Specifica','Albero non radicato, valori locali → minimo globale. BL, CN, TR, FIFO; ogni nodo sa di essere in un albero e conosce i vicini.'),
  p('Passi','1. Wake-up. 2. Le foglie inviano il valore; un interno che ha ricevuto da tutti tranne uno aggrega e invia al vicino rimasto. 3. La coppia saturata diffonde il risultato verso l’esterno.'),
  diagram('tree'),
  p('Prova','Ogni messaggio riassume una componente separata dall’arco. La saturazione termina in esattamente due vicini; insieme coprono l’albero. Quale coppia emerge dipende dai ritardi.'),
  formula('M ≤ 2(n−1) + n + (n−2) = 4n−4'),
  p('Ricorda','n≥2; per n=1 nessun invio. Risoluzione e saturazione sono finite. Su albero radicato: broadcast dalla radice e convergecast dei risultati dai figli.')),
  sec('Elezione nell’albero',
  p('Passi','Radicato: eleggi la radice (0 invii; notifica O(n)). Non radicato: trova la coppia saturata, confronta i suoi due ID, eleggi il minore e notifica.'),
  p('Costo','M≤4n−4 includendo attivazione; bit O(n+log MaxID), usando O(1) bit per saturare e due ID nel confronto.'),
  p('Attenzione','È il minimo della coppia; eleggere il minimo globale è un’altra applicazione, che aggrega gli ID.'))],
 [sec('All The Way',
  p('Specifica','Anello uni/bidirezionale → leader con ID minimo. Più iniziatori; nessun senso globale necessario sul bidirezionale.'),
  p('Passi','Ogni nodo avvia il proprio ID. Inoltra gli ID ricevuti all’altro vicino, aggiorna il minimo; ferma il proprio ID al ritorno.'),
  p('Termina','Con contatore di hop, il proprio ID restituisce n. Conta gli ID ricevuti, incluso il proprio: quando sono n, hai visto tutti. Alternativa: n noto; sul modello orientato, FIFO può aiutare a riconoscere la fine.'),
  p('Prova','Tutti gli ID fanno un giro completo: ciascun nodo conosce il minimo e decide il proprio stato. Nessuna notifica separata.'),
  formula('M = n²; Tᵢ ≤ 2n−1'),
  p('Costo','Tempo dalla prima attivazione nel caso a ritardo unitario. Gli hop richiedono anche O(log n) bit per messaggio.')),
  sec('As Far As It Can / LCR',
  p('Modello','Un solo senso di inoltro; n non noto, più iniziatori.'),
  p('Passi','Inoltra solo un ID minore del minimo visto. Se ti sveglia un ID maggiore del tuo, fermalo e avvia il tuo; se minore, inoltralo. Il ritorno del proprio ID elegge; poi notifica.'),
  diagram('ring',notes=['ID crescenti →','percorsi: n, n−1, …, 1','solo il minimo','completa il giro']),
  p('Prova','Il minimo non viene bloccato; ogni altro ID incontra prima un ID minore.'),
  p('Costo','Worst case: n(n+1)/2+n invii. Best: 2n (solo il minimo iniziatore). Tᵢ≤3n−1 con risveglio progressivo unitario e notifica.'))],
 [sec('Controlled Distance / HS',
  p('Modello','Anello bidirezionale, ID distinti; n non noto; più iniziatori. Candidati iniziali o attivati al risveglio.'),
  p('Passi','Stage i: Forth in entrambi i sensi fino a 2ⁱ hop; ID minore sconfigge il candidato maggiore. Se raggiunge il limite torna Back; due Back autorizzano lo stage successivo. Un Forth tornato dopo il giro elegge, poi notifica.'),
  diagram('hs'),
  p('Prova','Il minimo globale sopravvive. Per i≥1, i candidati hanno distanza ≥2ⁱ⁻¹+1; ce ne sono al più ⌊n/(2ⁱ⁻¹+1)⌋. Ciascuno costa ≤4·2ⁱ invii: meno di 8n per stage interno.'),
  formula('M = O(n log n)'),
  p('Termina','Il raggio raddoppia: d=⌈log₂n⌉, stage 0,…,d. Stage 0 ≤4n, finale 2n, notifica n; totale ≤7n+8n(d−1) per n≥2.'),
  p('Tempo','Tᵢ=O(n) con avvii simultanei, ritardi unitari e senza code: la somma dei raggi è geometrica. Non è un bound fisico asincrono.')),
  sec('Perché gli ID contano',
  p('Ipotesi','Protocollo deterministico per tutte le reti; due nodi anonimi sincroni nello stesso stato.'),
  p('Prova','Ricevono gli stessi eventi e restano identici a ogni passo ⇒ entrambi leader o entrambi follower.'),
  p('Limite','L’elezione non è garantita in generale senza rompere la simmetria. Una radice designata o la casualità cambiano le ipotesi.'))]
], 'D pp. 110–138, 139–195; A §§Saturazione, Leader election in alberi/anelli; C04–C05, B11–B12. MaxID = massimo identificativo.')

page('06  Leader: usare topologia, tempo e casualità','Grafi connessi affidabili; ID distinti per i protocolli deterministici • α = ID minimo (intero non negativo).',[
 [sec('FloodMax su grafo generico',
  p('Modello','Link bidirezionali, FIFO, round coordinati; diametro D o un suo upper bound L noto a tutti.'),
  p('Passi','Inizia dal tuo ID; a ogni round invia il massimo noto a tutti i vicini, attendi i messaggi del round e aggiorna. Dopo L round eleggi l’ID massimo.'),
  p('Invariante','Dopo r round conosci il massimo nella palla di r hop. Se L≥D, tutti conoscono il massimo globale.'),
  formula('M = 2mL; T = L round')),
  sec('YO-YO: senza diametro noto',
  p('Passi','Scambia ID coi vicini; orienta dal minore al maggiore: è un DAG. Source = solo uscite; sink = solo entrate.'),
  diagram('yoyo'),
  p('Passi','YO: le source inviano ID; ogni interno attende tutte le entrate e inoltra il minimo. −YO: sink votano YES agli archi col minimo, NO agli altri.'),
  p('Passi','Interno: se riceve un NO, restituisce NO a tutte le entrate; altrimenti YES solo da dove è arrivato il minimo. Source con NO sconfitta. Inverti gli archi con NO.'),
  p('Prova','Il DAG si conserva; il minimo non è sconfitto. Collega due source se condividono un sink: in ogni cammino almeno una su due è sconfitta. I cammini superstiti dimezzano ⇒ O(log n) iterazioni.'),
  p('Termina','Pruning: elimina sink con una sola entrata e copie duplicate del minimo, conservandone una. L’unica source resta senza archi e notifica sui link potati.'),
  p('Costo','Setup 2m, ≤2m per iterazione, notifica n−1: M=O(m log n). Nessun tempo preciso trasferito a ritardi asincroni.'))],
 [sec('Speeding: ID piccoli più veloci',
  p('Modello','Anello sincrono unidirezionale; n non noto. Analisi qui con avvio simultaneo. Ogni ID occupa un messaggio logico.'),
  p('Passi','Regola di eliminazione come LCR. Un ID i più piccolo viene inoltrato dopo un’attesa 2ⁱ. Al ritorno del proprio ID: leader, poi notifica senza attesa.'),
  p('Prova','Il minimo viaggia più veloce. Il candidato j-esimo ha ID ≥α+j−1: i suoi hop prima della notifica decrescono geometricamente. La somma resta O(n).'),
  formula('M = O(n); T = O(2ᵅn)'),
  p('Costo','B=O(n log(MaxID+2)). Con pacchetti di c bit bisogna contare la frammentazione: O(n) invii logici non implica O(n) pacchetti.')),
  sec('Waiting: scadenze separate',
  p('Modello','Anello sincrono orientato, n noto. Attendi f(i,n); se nessuna notifica è arrivata, eleggiti e inviala.'),
  p('Prova','Sia t(i) il risveglio di i. Per minimo x e rivale y, serve t(x)+f(x,n)+d(x,y) < t(y)+f(y,n). La notifica deve precedere la scadenza rivale.'),
  p('Passi','Avvio simultaneo: f(i,n)=ni. Scarto tra ID consecutivi =n > distanza massima n−1. M=n messaggi di un bit.'),
  p('Passi','Risveglio progressivo: propaga wake-up e usa f(i,n)=2ni. Ritardo di risveglio più distanza <2n. M=2n messaggi di un bit.'),
  formula('T = O((α+1)n)'),
  p('Nota','Il termine +1 copre α=0; non eliminare la dipendenza dal valore dell’ID.'))],
 [sec('Universal Waiting',
  p('Specifica','Grafo generico sincrono → minimo ID; n noto, tempo per arco ≤1.'),
  p('Passi','Diffondi start; all’attivazione attendi 2ni. Se non arriva stop, eleggiti e diffondi stop. Chi riceve stop rinuncia e lo inoltra.'),
  p('Prova','Attivazione e stop viaggiano in meno di n unità: scarto 2n tra scadenze consecutive evita due leader. Serve un limite sul tempo, non solo il nome “diametro”.'),
  p('Costo','Con due flooding: O(m) invii e O((α+1)n) unità; conteggio derivato sotto il modello appena dichiarato.')),
  sec('Leader election randomizzata',
  p('Modello','Anello anonimo sincrono orientato, n noto; round con rilevazione dei pareggi. n≥2.'),
  p('Passi','A ogni round scegli 0 con probabilità 1/n, 1 altrimenti. Waiting cerca il minimo; è leader solo se unico. Il giro in n unità lo certifica; altrimenti restart.'),
  formula('p = (1−1/n)ⁿ⁻¹ → 1/e'),
  p('Prova','Successo = esattamente uno zero. I round indipendenti danno P(fallimento dopo r)=(1−p)ʳ →0. Il minimo unico è un solo nodo.'),
  p('Costo','O(n) tempo e bit per round; E[round]=1/p≤e ⇒ O(n) tempo e bit attesi. Nessun massimo deterministico di round.'),
  p('Ricorda','Las Vegas: risultato corretto, qui termina con probabilità 1. Monte Carlo: tempo limitato ma possibile errore.'))]
], 'D pp. 198–258, 260–296; A §§FloodMax, YO-YO, Speeding, Waiting, Elezione casuale; B12–B13. m=archi; L=bound del diametro.')
page('07  Routing: dalla rete alle tabelle','n=|V|, m=|E| • Link bidirezionali, rete connessa affidabile, ID distinti; ogni nodo conosce vicini e costi locali.',[
 [sec('Gossiping: ricostruire la mappa',
  p('Specifica','Informazioni locali → ogni nodo ottiene il grafo e calcola la tabella destinazione / next hop / costo.'),
  p('Passi','Costruisci uno spanning tree (SHOUT+). Scambia le informazioni sui vicini. Ogni nodo diffonde la propria lista sull’albero; poi calcola localmente i cammini minimi.'),
  diagram('flow',labels=['liste locali','mappa G\nin ogni nodo','tabelle'],caption='comunicazione → calcolo locale'),
  p('Prova','L’albero raggiunge tutti: ogni lista arriva a ogni nodo. Con la mappa completa, un algoritmo centrale corretto produce i cammini minimi.'),
  p('Costo','Ogni elemento di vicinato percorre n−1 archi: (n−1)Σₓdeg(x)=2m(n−1), più setup O(m). Totale O(mn) trasmissioni di elementi.'),
  p('Spazio','Θ(n+m) record per la mappa in ciascun nodo durante la costruzione. Il calcolo locale aggiunge il costo dell’algoritmo scelto.'),
  p('Attenzione','Accorpare una lista in un pacchetto cambia il numero di invii, non la quantità di dati da diffondere.')),
  sec('La proprietà che permette il routing',
  p('Prova','Il suffisso di un cammino minimo è ancora minimo: altrimenti sostituiscilo con uno più economico e migliori il cammino originale.'),
  p('Spazio','Una tabella ha n record: destinazione, next hop, costo. In bit vanno contate sia la lunghezza degli ID sia quella dei costi.'))],
 [sec('Iterating / distance-vector',
  p('Specifica','G pesato con costi non negativi → distanze e next hop per tutte le destinazioni, senza mappa globale. n noto e round coordinati.'),
  p('Passi','D₀(x,x)=0; D₀(x,z)=∞ se z≠x. A ogni round scambia il vettore con i vicini e aggiorna con Bellman–Ford; memorizza il vicino che realizza il minimo.'),
  formula('Dₖ(x,z)=min{Dₖ₋₁(x,z),'),
  formula('minᵧ∈N(x)[c(x,y)+Dₖ₋₁(y,z)]}'),
  p('Invariante','Dopo k round conosci il minimo costo con ≤k archi. Senza cicli negativi basta un cammino semplice: qui i costi non negativi garantiscono ≤n−1 archi.'),
  p('Costo','n−1 round; 2m(n−1) invii di vettori = O(mn). Ogni vettore contiene n costi ⇒ O(mn²) elementi trasmessi.'),
  p('Spazio','n record propri; se conservi tutti i vettori ricevuti, O(n·deg(x)) record al nodo x. La codifica in bit dipende dai costi.')),
  sec('Min-Hop: un livello per volta',
  p('Specifica','Sorgente s; archi di costo uguale → albero BFS. Anche in asincrono, con livelli coordinati esplicitamente.'),
  p('Passi','Start sull’albero parziale → frontiera esplora → primi arrivi scelgono parent → risposte → convergecast. Avvia il livello seguente solo quando quello attuale è chiuso.'),
  p('Invariante','Inizio i: nodi a distanza ≤i−1. Fine i: esattamente quelli a distanza ≤i. Stop con n noto o dopo un livello senza nuove scoperte.'),
  p('Costo','M≤2(n−1)D+2m, più O(n) per stop/verifica finale; O(n²) su grafo semplice. Tᵢ=O((r(s)+1)²): costo O(i) per livello.'))],
 [sec('Dijkstra distribuito',
  p('Specifica','Sorgente s; pesi strettamente positivi → albero dei cammini di costo minimo. La radice coordina ogni aggiunta.'),
  p('Passi','Inizia con s e Δ(s)=0. Start sull’albero; ogni nodo x offre il miglior arco (x,y) verso l’esterno secondo Δ(x)+c(x,y). Il convergecast seleziona il minimo globale.'),
  diagram('flow',labels=['start','minimo\nal confine','aggiungi\nun nodo'],caption='poi aggiorna vicini e chiudi l’iterazione'),
  p('Passi','Notifica il vincitore lungo il cammino dell’albero; aggiungi y con distanza definitiva. y avvisa i vicini, attende gli Ack e segnala fine iterazione a s.'),
  p('Prova','Le distanze nell’albero sono definitive. Ogni cammino verso l’esterno attraversa il confine: con pesi positivi nessun cammino può battere l’offerta minima scelta.'),
  p('Termina','n−1 aggiunte se n noto. Altrimenti convergecast con “nessun candidato” da tutti; connettività ⇒ tutti coperti. Infine stop.'),
  formula('M = O(n²+m); Tᵢ = O(n²)'),
  p('Costo','Prima dello stop: M≤2(n−1)²+4m−2(n−1). Su grafo semplice è O(n²). Per n sorgenti, O(n³) invii; sovrapporre le istanze non riduce gli invii.'),
  p('Attenzione','Dijkstra sceglie distanza dalla sorgente; Prim sceglie peso del solo arco per un MST. Sono problemi diversi.'))]
], 'D pp. 299–351; A cap. 4; C06, B14. r(s)=eccentricità di s; D=diametro. Tutti i costi temporali distribuiti escludono ritardi fisici illimitati.')

page('08  Guasti: collegamenti e crash sincroni','F = massimo numero di guasti ammessi, noto quando richiesto • Agreement + validità + terminazione.',[
 [sec('Specificare cosa può guastarsi',
  p('Modello','Crash: il nodo si ferma, anche durante un invio. Omissione: un messaggio manca. Bizantino: comportamento arbitrario, anche valori diversi a destinatari diversi. Link e nodi sono componenti distinti.'),
  p('Specifica','Consenso booleano: i nodi corretti decidono lo stesso bit e terminano; se tutti partono da v, decidono v. Nel modello con soli guasti di link tutti i nodi sono corretti.'),
  p('Limite','Connettività per archi λ: il minimo numero di archi che disconnette. Per tollerare F omissioni permanenti occorre F<λ. Un taglio di ≤F archi può separare gruppi non coordinabili.')),
  sec('Due generali: impossibilità',
  p('Ipotesi','Link che può perdere messaggi; protocollo deterministico che deve coordinare l’attacco, anche con clock sincroni.'),
  p('Prova','Scegli un’esecuzione d’attacco con il minimo k di messaggi consegnati. k≥1: senza consegne manca il coordinamento. Elimina l’ultima consegna e ogni eventuale successiva.'),
  p('Prova','Il mittente non distingue le due esecuzioni e attacca ancora. Agreement impone che attacchi anche l’altro: ora bastano k−1 consegne, contraddizione.'),
  p('Limite','Contare le consegne è essenziale. Conferme ulteriori spostano soltanto l’ultimo messaggio che può andare perso.'))],
 [sec('Flooding tollerante / TwoSteps',
  p('Specifica','Completo Kₙ; sorgente x con I → tutti ricevono I. Nessun guasto dei nodi; ≤F<n−1 link con omissioni; x conosce F.'),
  p('Passi','x invia a F+1 vicini distinti. Solo chi riceve direttamente da x inoltra a tutti gli altri, escluso x.'),
  diagram('flow',labels=['x','F+1\nintermediari','ogni y'],caption='F guasti non bloccano F+1 vie disgiunte'),
  p('Prova','Se y è scelto: via diretta più F vie via altri intermediari. Altrimenti: F+1 vie di due archi. Le vie non condividono archi ⇒ almeno una sopravvive.'),
  formula('M ≤ (F+1)(n−1); Tᵢ ≤ 2'),
  p('Attenzione','È broadcast, non ancora consenso. F=0 resta O(n). Su grafo generico, flooding opera nel grafo residuo connesso; il diametro rilevante è quello residuo.'),
  p('Nota','Per consenso, tutti diffondono il proprio valore e applicano la stessa funzione quando la raccolta è completa. Il modello deve permettere di riconoscere il completamento. Non estendere questo argomento a corruzioni o aggiunte arbitrarie.'))],
 [sec('TellAll_Crash',
  p('Modello','Completo, link affidabili, avvio simultaneo, round sincroni, ≤F<n crash; bit iniziali.'),
  p('Passi','Report iniziale = proprio bit. Per F+1 round invia il report a tutti e sostituiscilo con l’AND del proprio e dei ricevuti. Messaggio assente entro fine round vale 1 (neutro). Poi decidi.'),
  diagram('timeline',labels=['0','1','…','F','F+1'],caption='uno zero trattenuto richiede crash distinti'),
  p('Prova','Se un corretto vede 0 entro F, lo invia a tutti al round seguente. Se 0 arrivasse solo ad alcuni corretti al round F+1, la catena precedente richiederebbe un nuovo crash a ogni round: più di F. Impossibile.'),
  p('Prova','Tutti 1 ⇒ solo 1; tutti 0 ⇒ ciascun corretto conserva 0. L’AND non crea uno zero mai visto.'),
  formula('T = F+1 round'),formula('M ≤ n(n−1)(F+1)'),
  p('Passi','Variante “solo zero”: non inviare 1; ciascun nodo invia 0 una sola volta, appena lo conosce.'),
  p('Costo','La variante usa ≤n(n−1)=O(n²) invii; servono ancora F+1 round. Il fattore F+1 copre anche F=0.'))]
], 'D pp. 354–411; A §§5.1, Consensus sincrono; C07, B15–B16. Il limite sui guasti è un’ipotesi, non una quantità osservata a fine esecuzione.')

page('09  Consenso randomizzato e bizantino','Quorum = insieme di mittenti distinti • Broadcast include il mittente • I messaggi portano il numero di round.',[
 [sec('FLP e Ben-Or con crash',
  p('Teorema','Asincrono, deterministico, anche un solo possibile crash e rete completa ⇒ impossibile garantire consenso con terminazione in tutte le esecuzioni ammesse (FLP).'),
  p('Nota','Intuizione: un ritardo non si distingue da un crash. La prova completa di FLP non è sviluppata qui; il solo timeout non risolve questa indistinguibilità.'),
  p('Modello','Ben-Or: completo affidabile, crash F<n/2; n,F noti; bit iniziali. Attendi n−F messaggi per fase; ignora round vecchi e conserva quelli futuri.'),
  p('Passi','1. Invia MyValue(r,v). Fra n−F ricevuti, se >n/2 contengono v, invia Propose(r,v); altrimenti Propose(r,?).'),
  p('Passi','2. Fra n−F Propose, se almeno uno è definito adotta v. Se almeno F+1 riportano v, decidi. Se sono tutti ?, scegli un bit uniforme per il round successivo.'),
  diagram('quorum',caption='n=7, F=2: (F+1)+(n−F) = 3+5 > 7'),
  p('Prova','Due maggioranze strette non possono sostenere valori opposti con soli crash. Se x decide v, i suoi F+1 mittenti intersecano ogni quorum n−F: tutti adottano v. Il round seguente porta alla decisione.'),
  p('Costo','O(n²) invii per round (due fasi); O(2ⁿ) round attesi nelle slide, terminazione quasi certa. Nessun massimo deterministico o tempo fisico uniforme.'),
  p('Nota','La decisione deve lasciare disponibili i messaggi che servono al round seguente; non va tradotta in arresto immediato prima degli invii richiesti.'))],
 [sec('RegisteredMail: proposta coerente',
  p('Modello','Sincrono, completo, F<n/3 bizantini. ID noti e non falsificabili; non si assumono firme digitali. Ogni identità può originare una sola proposta.'),
  p('Passi','y invia init(0,y,t). Ricevuto direttamente da y al tempo t+1, invia echo(0,y,t). Rifiuta identità, tempi e nuove origini incoerenti.'),
  p('Passi','Da t+2: F+1 echo distinti ⇒ ritrasmetti echo una volta; n−F echo distinti ⇒ accetta la proposta.'),
  diagram('flow',labels=['init valido','F+1 echo\npropaga','n−F echo\naccetta'],caption='F+1 include almeno un corretto'),
  p('Prova','Se un corretto accetta, almeno n−2F≥F+1 echo sono corretti. Raggiungono tutti, che ritrasmettono; entro il round seguente tutti accettano.'),
  p('Costo','Un’origine corretta è accettata in 2 unità. O(n²) invii dei corretti per proposta (ciascuno invia echo al più una volta); il traffico arbitrario richiede limiti espliciti.'),
  tag='STATUS D’ESAME DA CONFERMARE'),
  sec('Soglia deterministica bizantina',
  p('Teorema','Nel modello sincrono senza firme, con rete completa, F≥n/3 impedisce il consenso deterministico. Gli ID non falsificabili non impediscono l’equivocazione del proprio mittente.'),
  p('Nota','Le slide enunciano il limite; non ne ricostruiamo una prova completa. Ogni protocollo va letto con la propria soglia.') )],
 [sec('TellZero-Byz',
  p('Specifica','Stesso modello di RegisteredMail, avvio simultaneo → accordo dei corretti sul bit. Si propagano soltanto prove per 0.'),
  p('Passi','t=0: chi parte con 0 avvia RegisteredMail. t=2i, 1≤i≤F+1: se non hai già originato e hai accettato >F+i−1 identità, avvia la tua proposta.'),
  p('Passi','t=2(F+2): decidi 0 se hai ≥2F+1 identità accettate; altrimenti 1.'),
  p('Prova','Tutti 0 ⇒ almeno n−F≥2F+1 proposte. Tutti 1 ⇒ solo ≤F origini faulty: nessun corretto supera la prima soglia.'),
  p('Prova','Una decisione 0 implica almeno F+1 origini corrette. Le proposte accettate si propagano; una nuova origine allo stage i porta tutti oltre F+i entro lo stage i+1. La crescita obbliga tutti a superare la soglia finale.'),
  formula('T = 2(F+2); M = O(n³)'),
  p('Costo','Per contare anche i faulty: al più un messaggio per vicino per unità sincrona, come nelle slide. Nessun nodo può originare ripetutamente.'),
  tag='STATUS D’ESAME DA CONFERMARE'),
  sec('Bizantino randomizzato',
  p('Modello','Completo, ID autenticati, F<n/9; bit iniziali. Attendi n−F Propose del round, da mittenti distinti.'),
  p('Passi','≥n−2F uguali a v: adotta e decidi. Altrimenti ≥n−4F: adotta. Altrimenti: bit uniforme. Trasmetti il valore nel round successivo anche prima di uscire per decisione.'),
  p('Costo','O(n²) invii dei corretti per round; O(2ⁿ) round attesi nel modello delle slide. Prova e limiti nella pagina successiva.'))]
], 'D pp. 385, 412–474; A §§Ben-Or, RegisteredMail/TellZero-Byz, Consensus bizantino; C07, B16. F è il bound, non il numero effettivo di faulty.')

page('10  Chord: trovare una chiave mentre la rete cambia','DHT = tabella hash distribuita • n = nodi presenti; b = bit degli ID (m nelle slide) • Spazio circolare 0,…,2ᵇ−1.',[
 [sec('Assegnazione e lookup base',
  p('Specifica','Nodi e chiavi hanno un ID hash nello stesso spazio. Chiave k → nodo successor(k), primo ID ≥k in senso circolare; dopo il massimo riparti da 0.'),
  p('Modello','Overlay logico; conosci il successore. Per la garanzia di base: successori corretti e nessun guasto durante la ricerca.'),
  p('Passi','Se ospiti k rispondi; altrimenti inoltra al successore. La visita progredisce sull’anello fino al responsabile.'),
  formula('lookup base: O(n) hop'),
  diagram('chord'),
  p('Esempio','b=6, nodi 4,8,15,20,32,35,44,54: k=37 è di N44. Lo spazio ha 64 ID, ma i nodi sono soltanto 8.'),
  p('Ricorda','Un hop overlay può attraversare molti link fisici. O(log n) hop non è un tempo di rete espresso in secondi.'))],
 [sec('Finger table: saltare più lontano',
  p('Passi','Al nodo i, per j=1,…,b conserva finger[j]=successor((i+2^(j−1)) mod 2ᵇ). La prima finger è il successore.'),
  p('Passi','Per lookup(k): controlla prima il nodo e il suo successore. Altrimenti scegli la finger che precede k più da vicino, senza superarlo. Se manca, usa il successore.'),
  p('Prova','Con puntatori validi la ricerca avanza verso k senza scavalcare il responsabile. Con ID ben distribuiti, i salti riducono mediamente la distanza.'),
  formula('lookup: O(log n) hop medi'),
  p('Spazio','b record per nodo; i bit dipendono dalla codifica di ID e indirizzi.'),
  p('Limite','Il costo medio richiede distribuzione adeguata degli ID e tabelle mantenute. Non è un worst case per ogni disposizione o guasto.')),
  sec('Join: assegnare anche i dati',
  p('Passi','Il nuovo nodo conosce un partecipante; trova il proprio successore, inizializza predecessore e finger, aggiorna i riferimenti coinvolti e riceve le chiavi del suo intervallo.'),
  p('Costo','Le slide danno O(log²n) tempo medio per l’aggiornamento esplicito. Il trasferimento dei valori dipende dai dati.'),
  p('Prova','Inserendo x tra p e s, le chiavi nell’intervallo (p,x] passano da s a x. Gli altri restano uguali.'))],
 [sec('Stabilize e refresh',
  p('Passi','A chiede al successore B il suo predecessore B′. Se B′∈(A,B), A usa B′ come nuovo successore. A notifica il successore scelto, che aggiorna il predecessore se opportuno.'),
  diagram('flow',labels=['A','B′ nuovo','B'],caption='intervallo circolare: A < B′ < B'),
  p('Passi','Periodicamente ricalcola una finger. Con successori corretti, finger obsolete verso nodi vivi possono rallentare il lookup, che conserva il fallback sul successore.'),
  p('Costo','Scambi locali per una chiamata; nessun bound globale di convergenza per join concorrenti arbitrari nelle fonti del corso.')),
  sec('Leave, failure e replica',
  p('Passi','Uscita pulita: trasferisci i dati al successore; collega predecessore e successore; aggiorna progressivamente le finger.'),
  p('Passi','Crash: nessun trasferimento finale. Mantieni una successor list di r nodi; prova il primo vivo. Finger guasta: torna a una finger precedente o alla lista; poi stabilizza.'),
  p('Prova','Il routing continua se resta un successore vivo raggiungibile e l’anello non è partizionato. Riparare i puntatori non recupera dati conservati solo sul guasto.'),
  p('Passi','Replica chiave-valore sui primi r successori; il primo vivo assume la responsabilità e ricostituisce le repliche.'),
  p('Costo','O(b+r) record di routing per nodo; spazio e traffico delle repliche crescono con r e i dati.'),
  p('Limite','Nessuna garanzia generale per partizioni o inserimenti simultanei arbitrari: valgono le ipotesi di interleaving del modello delle slide.'))]
], 'D pp. 494–511; A cap. 6 “Chord”; C08, B17. b evita di confondere i bit degli ID con il numero m di archi usato nelle altre pagine.')
# Impaginazione finale: più pagine autorizzate dall'utente il 29 settembre.
S={s['title']:s for pg in PAGES for col in pg['cols'] for s in col}
OLD=PAGES[:]
PAGES=[]
def pick(*names):return [S[n] for n in names]
def new(title,sub,cols,ref):page(title,sub,cols,ref)

new('Fondamenti e complessità', OLD[0]['sub'],OLD[0]['cols'],OLD[0]['refs'])
new('TSP generale e ricerca esatta',OLD[1]['sub'],[
 pick('HC usando il TSP esatto','TSP generale: nessun ρ costante'),
 pick('Branch & Bound: minimo esatto','TSP: lower bound con 1-tree')
], 'C pp. 24–26, 68–69, 97–104; A “TSP è NP-hard”, “Branch and bound”; M04, C02, B04, B06. B&B e 1-tree: facoltativi.')
new('TSP metrico: le due approssimazioni',OLD[1]['sub'],[
 pick('TSP metrico: strumenti comuni','2-approssimazione'),pick('Christofides: fattore 3/2')
], 'C pp. 69–74; A “Approssimazioni per il TSP metrico”; M05, B05. T* = MST; V_d = dispari; G_d = completo indotto; M* = matching minimo.')
new('Vertex Cover: decisione, ricerca, approssimazione', OLD[2]['sub'],[
 pick('VC: tre scelte greedy'),pick('Relax & Round: fattore 2','Self-reduction con oracolo VCD')
], 'C pp. 55–60, 63–67; A “Vertex Cover”, “Self-reduction”, “Relax & Round”; M06, B07. OPT = soluzione ottima; E′ = archi scelti dal greedy.')
new('Diffusione: modello, broadcast e wake-up',OLD[3]['sub'],[
 pick('Il modello viene prima del bound','Flooding / Broadcast'),
 pick('WFlood / Wake-up')+[sec('Lower bound: perché è inevitabile',
 p('Ipotesi','Protocollo generico corretto su ogni grafo connesso, senza mappa globale o conoscenza di n.'),
 p('Prova','Se un arco non trasporta alcun messaggio, sostituiscilo con un cammino attraverso un nuovo nodo dormiente. Gli estremi non distinguono la rete; il nuovo nodo non riceve nulla. Contraddizione.'),
 formula('M ≥ m; Flooding usa M < 2m'),
 p('Tempo','Da una sorgente s servono almeno r(s) unità ideali. Nel caso peggiore sulla sorgente serve D. Flooding raggiunge questi limiti.'),
 p('Limite','Il bound m non vale per algoritmi che sfruttano una topologia nota: il completo noto permette n−1 invii diretti.'))]
], 'D pp. 22–68; A §§Modello, Broadcast, Wake-up; M07–M08, B08–B09. Qui n≥2; per n=1, zero invii e tempo nullo. Tᵢ: ultima prima ricezione, non svuotamento dei canali.')
new('Spanning tree: parallelo o visita sequenziale?',OLD[3]['sub'],[
 pick('SHOUT e SHOUT+')+[sec('Che cosa certifica la fine?',
 p('Ricorda','SHOUT/SHOUT+: ogni nodo sa di aver classificato i propri vicini, ma non rileva la fine globale. DFT: il ritorno del token consente alla radice di sapere che la visita è finita.'),
 diagram('triangle'),
 p('Esempio','Nel triangolo, SHOUT raggiunge gli altri due nodi al tempo 1; Q incrociate al tempo 2, NO al tempo 3. Per tutti DONE serve r(s)+2=3.'),
 p('Spazio','O(deg(x)) record locali per vicini, archi dell’albero e stato della visita; gli identificativi, se memorizzati, hanno un costo in bit separato.'))],
 pick('DFT: un token alla volta','DFT con Visited / Ack')
], 'D pp. 71–109; A §§SHOUT, DFT; M09, B10. In questa pagina: unico iniziatore, BL/CN/TR, vicini noti; FIFO solo dove indicato.')
# Replace the triangle under SHOUT with a literal timing diagram, not a metric triangle.
PAGES[-1]['cols'][0][1]['blocks']=tuple(diagram('timeline',labels=['t=0','t=1','t=2','t=3'],caption='s invia Q → scoperta → Q incrociate → NO') if b[0]=='diagram' else b for b in PAGES[-1]['cols'][0][1]['blocks'])
new('Saturazione ed elezione: raccogliere i valori', OLD[4]['sub'],[
 pick('Saturazione su alberi','Elezione nell’albero'),pick('All The Way','Perché gli ID contano')
], 'D pp. 110–154; A §§Saturazione, Leader election in alberi, All The Way; C04–C05, B11–B12. MaxID = massimo ID.')
new('Elezione in anello: fermare i candidati',OLD[4]['sub'],[
 pick('As Far As It Can / LCR')+[sec('Ricostruire il costo di LCR',
 p('Esempio','ID 1,2,3,4,5 crescenti nel senso di inoltro, tutti svegli: 1 viaggia 5 archi, 2 ne viaggia 4, poi 3,2,1. Totale 15 invii elettorali + 5 di notifica.'),
 formula('Σⱼ₌₁ⁿ j = n(n+1)/2'),
 p('Ricorda','La somma conta tutti gli invii, anche in parallelo. Il tempo segue invece una catena: risveglio del minimo, giro dell’ID, giro di notifica.'),
 p('Nota','ID minimo unico ⇒ un solo leader. Per n=1 il nodo è già l’unico candidato; i conteggi a stage assumono n≥2.'))],
 pick('Controlled Distance / HS')+[sec('Il vantaggio del raddoppio',
 p('Prova','Un raggio grande costa di più per candidato, ma lascia meno candidati: costo O(n) per stage × O(log n) stage. Il tempo somma 1+2+4+…+2ᵈ=O(n).'),
 p('Attenzione','Per le prove di spaziatura contano gli stage completati, anche se l’esecuzione è asincrona. Il bound temporale qui usa il modello ideale indicato.'))]
], 'D pp. 155–195; A §§As Far As It Can, Controlled Distance; C05, B12. Tutti i costi in messaggi includono la notifica finale.')
new('Elezione in grafi generici','Grafi connessi, bidirezionali e affidabili; ID distinti • n = nodi, m = archi.',[
 pick('FloodMax su grafo generico')+[sec('Stesso problema, conoscenze diverse',
 p('Ricorda','FloodMax propaga il massimo per un numero noto di round. YO-YO propaga il minimo e riduce il grafo logico fino a poter rilevare la fine.'),
 diagram('flow',labels=['leader unico','costruzione\nspanning tree','broadcast\nsu n−1 archi'],caption='la notifica e la costruzione hanno costi propri'),
 p('Prova','Un leader può avviare un protocollo a iniziatore unico. Se invece è già disponibile un albero con radice designata, la radice può essere leader: l’asimmetria è già data.'),
 p('Nota','m conta gli archi fisici. Il pruning di YO-YO modifica gli archi logici usati, non cancella collegamenti dalla rete.'),
 p('Limite','Il bound O(m log n) deriva dal lemma sulle iterazioni; la sola eliminazione di “almeno una source” darebbe soltanto O(n) iterazioni.'))],
 pick('YO-YO: senza diametro noto')
], 'D pp. 198–258; A §§FloodMax, YO-YO; C05, B12. Setup YO-YO: scambio ID; nessuna conoscenza del diametro richiesta.')
new('Elezione sincrona: tempo e casualità',OLD[5]['sub'],[
 pick('Speeding: ID piccoli più veloci','Waiting: scadenze separate'),
 pick('Universal Waiting','Leader election randomizzata')
], 'D pp. 260–296; A §§Speeding, Waiting, Universal Waiting, Elezione casuale; B13. Unità temporale = bound di trasmissione noto; c = bit per pacchetto.')
new('Routing: tutte le destinazioni',OLD[6]['sub'],[
 pick('Gossiping: ricostruire la mappa','La proprietà che permette il routing'),
 pick('Iterating / distance-vector')+[sec('Confrontare la stessa unità',
 p('Costo','Gossiping: O(mn) elementi di vicinato. Iterating: O(mn²) elementi di vettore, ma O(mn) invii se il vettore intero conta come messaggio.'),
 diagram('flow',labels=['1 invio','vettore di\nn costi','n elementi'],caption='invii, elementi e bit sono tre misure diverse'),
 p('Ricorda','Aumentare la dimensione massima di un messaggio può ridurre gli invii senza ridurre i bit. Un bound in record di memoria non è automaticamente un bound in bit.'),
 p('Nota','Questi protocolli costruiscono tabelle su una topologia stabile. Cambiamenti o guasti richiedono regole ulteriori, non deducibili dal solo conteggio statico.'))]
], 'D pp. 299–315; A cap. 4, Gossiping e Iterating; C06, B14. Se le distanze hanno codifica lunga, aggiungerne i bit al costo dei record.')
new('Routing: alberi dei cammini minimi',OLD[6]['sub'],[
 pick('Min-Hop: un livello per volta')+[sec('Da dove vengono i due bound?',
 p('Messaggi','Sia nᵢ il numero di nodi nell’albero all’inizio del livello i. Start e convergecast usano 2(nᵢ−1) invii; sommando i livelli: ≤2(n−1)r(s). Le esplorazioni complessive costano 2m.'),
 formula('M ≤ 2(n−1)D + 2m + O(n)'),
 p('Tempo','Ogni livello i: discesa i−1, esplorazione/risposta 2, risalita i−1 ⇒ 2i unità ideali.'),
 formula('Σᵢ₌₁ʳ 2i = r(r+1)'),
 p('Ricorda','L’eventuale livello finale senza nuove scoperte porta a r+1. La garanzia di BFS dipende dalla barriera fra livelli, non dall’ordine casuale degli arrivi.'),
 diagram('flow',labels=['livello i−1','esplora\nfrontiera','chiudi i'],caption='prima di i+1 attendi tutte le risposte'))],
 pick('Dijkstra distribuito')+[sec('Una sorgente o tutte?',
 p('Costo','Su grafo semplice, ciascun albero costa O(n²) invii. Ripetere da ogni sorgente costa O(n³) invii complessivi. Il tempo dipende dall’esecuzione concorrente o sequenziale.'))]
], 'D pp. 321–351; A §§Min-Hop, Dijkstra; C06, B14. r=r(s), D=diametro; Δ(x)=distanza pesata definitiva dalla sorgente s.')
new('Guasti: collegamenti e crash sincroni',OLD[7]['sub'],OLD[7]['cols'],OLD[7]['refs'])

# Complete the randomized proof, keeping the course thresholds explicit.
ben=S['FLP e Ben-Or con crash']
ben['blocks']=ben['blocks'][:-2]+(
 p('Prova','Le preferenze adottate senza lancio hanno lo stesso valore. Con monete indipendenti, nel ragionamento per round del corso, la probabilità di allineamento è ≥2^(−n): terminazione quasi certa, O(2ⁿ) round attesi.'),
 p('Costo','Due fasi: O(n²) invii per round. Il bound atteso conta round logici, non secondi né un massimo deterministico.'),
 p('Nota','Dopo la decisione continua gli invii necessari al round seguente; un arresto immediato può impedire agli altri di completare il quorum.'))
byz=sec('Bizantino randomizzato: soglie e prova',
 p('Modello','Completo affidabile, round asincroni numerati, ID di mittente non falsificabili, bit iniziali, n,F noti, F<n/9. Attendi n−F mittenti distinti; conserva messaggi futuri. Include il proprio messaggio.'),
 p('Passi','Avvia Propose col bit iniziale. Fra n−F ricevuti: se ≥n−2F riportano v, adotta e decidi. Altrimenti, se ≥n−4F riportano v: adotta. Altrimenti estrai un bit uniforme. Invia Propose per il round successivo prima di uscire per decisione.'),
 diagram('flow',labels=['n−F\nattendi','n−4F\nadotta','n−2F\ndecidi'],caption='le soglie riguardano lo stesso valore'),
 p('Prova','Se x decide v, un altro quorum può perdere F mittenti e avere F equivoci: restano ≥n−2F−2F=n−4F copie v. Tutti adottano v; il round seguente conclude.'),
 p('Prova','Due adozioni non casuali opposte richiederebbero almeno n−5F corretti per valore. Anche contando F faulty: 2(n−5F)+F=2n−9F>n, impossibile.'),
 p('Prova','Tutti inizialmente v: anche sottraendo F mittenti mancanti e F faulty restano n−2F corretti per v. La validità segue senza fidarsi dei bizantini.'),
 p('Costo','Monete indipendenti: probabilità di allineamento ≥2^(−n) nel ragionamento del corso ⇒ O(2ⁿ) round attesi. O(n²) invii dei corretti per round; il traffico faulty va limitato a parte.'),
 p('Nota','Slide p. 474: variante con F<n/500 e O(n^2.5) round attesi, protocollo non sviluppato. Slide p. 431: variante crash con circa n/3 guasti e round attesi costanti; non è il Ben-Or qui descritto.'))
new('Consenso asincrono: quorum e casualità',OLD[8]['sub'],[[ben],[byz]],
 'D pp. 385, 412–431, 465–474; A §§Ben-Or, Consensus randomizzato bizantino; Santoro §7.4.2, PDF pp. 459–462; B16. Ipotesi sui round: coverage.md.')
new('Consenso bizantino deterministico',OLD[8]['sub'],[
 pick('RegisteredMail: proposta coerente','Soglia deterministica bizantina'),
 pick('TellZero-Byz')+[sec('La soglia cresce con lo stage',
 diagram('timeline',labels=['0','2','2i','2(F+2)'],caption='origini con 0 → propagazione → soglia 2F+1'),
 p('Prova','Se un corretto origina allo stage i≤F, aveva >F+i−1 origini accettate. Entro 2i+2 tutti ricevono quelle e la sua: >F+i, abbastanza per originare allo stage successivo.'),
 p('Prova','Se ci sono almeno F+1 origini corrette, o una nasce entro lo stage F e attiva la propagazione, oppure una nasce all’ultimo stage: le >2F prove già accettate raggiungono tutti entro il tempo finale.'))]
], 'D pp. 432–464; A “Consensus deterministico con fallimenti bizantini”; C07, B16. n>3F; stage i inizia a t=2i. Status da confermare.')

# Keep Chord on one page by giving its lifecycle two compact, precise cards.
S['Stabilize e refresh']['blocks']=(
 p('Passi','A chiede a B=succ(A) il predecessore B′. Se B′∈(A,B), aggiorna succ(A)=B′. A notifica il successore scelto, che aggiorna il predecessore se opportuno.'),
 p('Passi','Ricalcola periodicamente una finger. Con successori corretti e finger obsolete verso nodi vivi, il fallback permette di proseguire.'),
 p('Costo','Scambi locali per chiamata; nessun bound globale di convergenza per join concorrenti arbitrari attestato dal corso.'))
S['Leave, failure e replica']['blocks']=(
 p('Passi','Leave pulita: trasferisci dati al successore e collega predecessore e successore; poi aggiorna le finger.'),
 p('Passi','Crash: prova i successori della lista di r nodi fino al primo vivo. Finger guasta: finger precedente o successor list. Stabilizza i puntatori.'),
 p('Prova','Routing possibile se rimane un successore vivo raggiungibile e l’anello non è partizionato. I puntatori non recuperano i dati persi.'),
 p('Passi','Replica i dati sui primi r successori. Il primo vivo diventa responsabile e ricostituisce le repliche.'),
 p('Costo','O(b+r) record di routing. Spazio e traffico dei dati dipendono da r e dal volume replicato.'),
 p('Limite','Nessuna garanzia generale su partizioni e interleaving arbitrari: vedere coverage.md.'))
new('Chord: lookup e cambiamenti della rete',OLD[9]['sub'],OLD[9]['cols'],OLD[9]['refs'])

# Render identical text/vector primitives to PDF and editable SVG.
def generate():
 cv=canvas.Canvas(str(OUT/'cookbook-algoritmi-distribuiti.pdf'),pagesize=(W,H),pageCompression=1)
 cv.setTitle('Cookbook di Algoritmi Distribuiti - prima versione completa')
 cv.setAuthor('Materiale di ripasso personale - fonti locali del corso')
 report=[]
 for idx,pg in enumerate(PAGES,1):
  cv.bookmarkPage(f'pagina-{idx:02}');cv.addOutlineEntry(pg['title'],f'pagina-{idx:02}',level=0)
  d=Draw(cv);d.rect(0,0,W,H,'white')
  d.text(24,23,'ALGORITMI DISTRIBUITI  /  COOKBOOK',8.5,'Bold',C['muted'])
  d.text(W-24,23,f'{idx:02} / {len(PAGES):02}',9.5,'Bold',C['blue'],'end')
  d.text(24,49,pg['title'],22,'Bold')
  sublines=wrap_runs([(pg['sub'],'Body',C['muted'])],W-48,9.6)
  for k,line in enumerate(sublines):
   xx=24
   for t,f,c in line:d.text(xx,66+k*12,t,9.6,f,c);xx+=width(t,9.6,f)
  start=82+(len(sublines)-1)*12
  ncols=len(pg['cols']);cw=(W-48-(ncols-1)*12)/ncols
  bottoms=[]
  for j,col in enumerate(pg['cols']):
   xx=24+j*(cw+12);yy=start
   for s in col: yy+=draw_card(d,xx,yy,cw,s)+10
   bottoms.append(yy-10)
  if max(bottoms)>565:
   raise ValueError(f'PAGE {idx} OVERFLOW: {bottoms}; {pg["title"]}')
  d.line(24,568,W-24,568,C['line'],.7)
  refs='Fonti: '+pg['refs']
  rr=wrap_runs([(refs,'Body',C['muted'])],W-48,7.6)
  for k,line in enumerate(rr):
   xx=24
   for t,f,c in line:d.text(xx,579+k*9,t,7.6,f,c);xx+=width(t,7.6,f)
  for x1,y1,x2,y2,tx in d.extents:
   if x1<19 or x2>W-19 or y1<10 or y2>H-3:raise ValueError(f'Outside page {idx}: {tx} {x1,y1,x2,y2}')
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(pg["title"])}">\n<title>{html.escape(pg["title"])}</title>\n'+FONT_CSS+'\n'+ '\n'.join(d.e)+'\n</svg>\n'
  (OUT/f'pagina-{idx:02}.svg').write_text(svg)
  report.append({'page':idx,'title':pg['title'],'bottoms':bottoms,'text_elements':len(d.extents),'body_pt':FS})
  cv.showPage()
 cv.save()
 (OUT/'source'/'layout-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':generate()
