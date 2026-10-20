"""Render the authored geometric identity into the site's social-sharing card."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root=Path(__file__).resolve().parent.parent
image=Image.new('RGB',(1200,630),'#101014')
draw=ImageDraw.Draw(image)
font=lambda size: ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf',size)
mono=lambda size: ImageFont.truetype('C:/Windows/Fonts/consola.ttf',size)
for x in range(800,1200,32): draw.line((x,0,x,630),fill='#202028')
for y in range(0,630,32): draw.line((800,y,1200,y),fill='#202028')
draw.rounded_rectangle((848,78,1124,553),radius=24,fill='#191920',outline='#a796ff',width=3)
draw.rectangle((874,140,1074,436),outline='#d5ff5f',width=3)
draw.rectangle((873,455,1097,495),fill='#43232e')
draw.text((892,466),'WORKING MARGINS',font=mono(17),fill='#ff9ea9')
scale=.155
point=lambda p:(int(64+p[0]*scale),int(60+p[1]*scale))
draw.rounded_rectangle((64,60,144,140),radius=16,fill='#191920',outline='#353540',width=2)
for line in [[(174,106),(106,106),(106,174)],[(338,106),(406,106),(406,174)],[(406,338),(406,406),(338,406)],[(174,406),(106,406),(106,338)]]:draw.line([point(p) for p in line],fill='#d5ff5f',width=4)
draw.line([point(p) for p in [(173,181),(339,181),(173,331),(339,331)]],fill='#a796ff',width=6)
draw.rounded_rectangle((*point((384,384)),*point((428,428))),radius=1,fill='#d5ff5f')
draw.text((162,71),'Creator',font=font(35),fill='#f3f3ee')
draw.text((162+draw.textlength('Creator',font=font(35)),71),'SafeZone',font=font(35),fill='#d5ff5f')
draw.text((164,115),'CREATIVE PLACEMENT STUDIO',font=mono(13),fill='#aaaab9')
draw.text((64,206),'Keep your creative',font=font(61),fill='#f3f3ee')
draw.text((64,286),'in the clear.',font=font(72),fill='#a796ff')
draw.rectangle((64,408,96,413),fill='#d5ff5f')
draw.text((64,450),'Preview. Mark. Plan your placement.',font=font(29),fill='#c1c1ce')
draw.text((64,504),'LOCAL FILES / NO SIGNUP',font=mono(17),fill='#d5ff5f')
image.save(root/'og-preview.png',optimize=True)
