/* Charlas guiadas: situaciones con personajes, respuestas esperadas y correcciones típicas de hispanohablantes. */
(function (G) {
  "use strict";
  const NUM = "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|a hundred|hundred)";
  const R = (s) => new RegExp(s.replace(/NUM/g, NUM), "i");
  const K = (s) => R("\\b(" + s + ")\\b");
  const SCENES = [
    {
      id: "meet", title: "Presentarte", sub: "Un evento de comunicación en Londres", level: "A2",
      who: { name: "Emma", role: "consultora de Londres", tone: "f", accent: "UK" },
      intro: "Estás en un evento de comunicación en Londres. Emma se acerca a charlar con vos.",
      start: "start",
      turns: {
        start: { say: "Hi there! I don't think we've met. I'm Emma.", es: "¡Hola! Creo que no nos conocemos. Soy Emma.", you: "Saludala y decile cómo te llamás.", hint: ["Nice to meet you", "I'm …"], model: ["Nice to meet you, Emma. I'm Maxi.", "Hi, Emma! I'm Maxi. Nice to meet you."], expect: [R("\\b(i'?m|i am|my name|name'?s|call me)\\b"), R("\\bnice to meet\\b")], slot: { name: R("(?:i'?m|i am|my name is|my name'?s|name'?s|call me)\\s+([a-z]+)") }, next: "from" },
        from: { say: "Nice to meet you, {name}. So, where are you from?", es: "Mucho gusto. ¿De dónde sos?", you: "Contale de dónde sos.", hint: ["I'm from …", "I live in …"], model: ["I'm from Argentina. I live in Buenos Aires.", "I'm from Buenos Aires, in Argentina."], expect: [R("\\b(from|argentina|buenos aires|i live|live in|born in)\\b")], slot: { place: R("\\b(?:from|in)\\s+(buenos aires|argentina|[a-z]+)") }, react: ["Oh, {place}! I've always wanted to go there.", "Wow, that's a long way from here!"], next: "job" },
        job: { say: "So, what do you do?", es: "¿Y a qué te dedicás?", you: "Contale de qué trabajás.", hint: ["I work in …", "I'm a …"], model: ["I work in digital communications for the government.", "I'm a communications strategist. I work for the government."], expect: [R("\\b(i work|i'?m a|i am a|i do|my job|communications?|government|marketing|lawyer|manager|social media|journalist|press|consultant|strategist)\\b")], react: ["That sounds really interesting.", "Oh, cool. That must be a busy job."], next: "long" },
        long: { say: "How long have you been doing that?", es: "¿Hace cuánto que hacés eso?", you: "Decile hace cuánto trabajás en eso.", hint: ["For … years", "Since …"], model: ["For about five years.", "I've been doing it for three years."], expect: [R("\\b(for|since|years?|months?|NUM|a long time|a while|recently)\\b")], next: "like" },
        like: { say: "And do you enjoy it?", es: "¿Y te gusta?", you: "Decile si te gusta y por qué.", hint: ["Yes, I love it because …", "It's hard, but …"], model: ["Yes, I love it. Every day is different.", "Yes, but it's very stressful sometimes."], expect: [R("\\b(yes|yeah|no|love|like|enjoy|of course|sometimes|it'?s|it is|but|a lot)\\b")], react: ["I know what you mean.", "That's great."], next: "first" },
        first: { say: "Is this your first time in London?", es: "¿Es tu primera vez en Londres?", you: "Respondé si es tu primera vez.", hint: ["Yes, it's my first time.", "No, I came in …"], model: ["Yes, it's my first time here.", "No, I was here two years ago."], expect: [R("\\b(yes|yeah|no|first time|second time|before|ago|never)\\b")], branch: [{ if: R("\\b(no|before|ago|second|third)\\b"), to: "first_no" }], next: "first_yes" },
        first_yes: { say: "How exciting! What would you like to see while you're here?", es: "¡Qué lindo! ¿Qué te gustaría conocer mientras estés acá?", you: "Contale qué te gustaría visitar.", hint: ["I'd like to see …", "I want to visit …"], model: ["I'd like to see the British Museum and Camden Market.", "I want to visit the Tower of London."], open: 3, next: "bye" },
        first_no: { say: "Oh, nice. What do you like most about the city?", es: "Ah, qué bien. ¿Qué es lo que más te gusta de la ciudad?", you: "Contale qué te gusta de Londres.", hint: ["I love the …", "The best thing is …"], model: ["I love the parks and the museums.", "The best thing is the public transport."], open: 3, next: "bye" },
        bye: { say: "Well, it was lovely to meet you, {name}. Shall we keep in touch?", es: "Bueno, fue un gusto conocerte. ¿Seguimos en contacto?", you: "Aceptá y proponé cómo seguir en contacto.", hint: ["Sure! Let's connect on …", "Of course. Here's my card."], model: ["Sure! Let's connect on LinkedIn.", "Of course. Here's my card."], expect: [R("\\b(sure|yes|yeah|of course|definitely|great|linkedin|card|email|number|instagram|keep in touch)\\b")], next: "end" },
        end: { say: "Perfect. Enjoy the rest of the event!", es: "Perfecto. ¡Disfrutá el resto del evento!", end: true }
      }
    },
    {
      id: "meeting", title: "Reunión por Zoom", sub: "Contale al equipo cómo va la campaña", level: "A2+",
      who: { name: "Sarah", role: "colega de un equipo internacional", tone: "f", accent: "US" },
      intro: "Arranca una reunión online con un equipo internacional. Sarah la coordina.",
      start: "start",
      turns: {
        start: { say: "Hi! Can you hear me okay?", es: "¡Hola! ¿Me escuchás bien?", you: "Decile que sí la escuchás.", hint: ["Yes, I can hear you.", "Loud and clear."], model: ["Yes, I can hear you perfectly.", "Hi, Sarah! Yes, loud and clear."], expect: [R("\\b(yes|yeah|hear|i can|perfect|clear|fine|okay|ok)\\b")], next: "intro" },
        intro: { say: "Great. Before we start, could you introduce yourself to the team?", es: "Genial. Antes de empezar, ¿te presentás al equipo?", you: "Presentate: nombre, dónde trabajás y qué hacés.", hint: ["Hi everyone, I'm …", "I work in … and I'm in charge of …"], model: ["Hi everyone, I'm Maxi. I work in digital communications for the Argentine government.", "Hello, I'm Maxi. I'm in charge of social media campaigns."], expect: [R("\\b(i'?m|i am|my name|i work|in charge|responsible|communications?|team|manage)\\b")], next: "update" },
        update: { say: "Thanks. So, how is the new campaign going?", es: "Gracias. Entonces, ¿cómo viene la nueva campaña?", you: "Contá cómo viene la campaña.", hint: ["It's going well. We launched …", "We're working on …"], model: ["It's going well. We launched it last week.", "It's going great. We already have good results."], open: 3, next: "results" },
        results: { say: "That's great to hear. Do you have any numbers yet?", es: "Qué bueno. ¿Ya tienen algún número?", you: "Dale un dato: alcance, vistas o porcentaje.", hint: ["We reached … people.", "Engagement went up … percent."], model: ["Yes, we reached two million people in the first week.", "Engagement went up thirty percent."], expect: [R("\\b(NUM|million|thousand|percent|people|views|followers|reach|reached|engagement|up|grew|increase)\\b")], react: ["Impressive!", "Wow, that's a lot."], next: "steps" },
        steps: { say: "What are the next steps?", es: "¿Cuáles son los próximos pasos?", you: "Contá qué van a hacer ahora.", hint: ["Next, we're going to …", "We'll launch …"], model: ["Next, we're going to launch a video series.", "We'll focus on Instagram and TikTok."], expect: [R("\\b(going to|gonna|we'?ll|will|next|plan|launch|focus|start|create|post|make)\\b")], next: "schedule" },
        schedule: { say: "Sounds like a plan. When can we meet again to review it?", es: "Me parece bien. ¿Cuándo nos volvemos a juntar para revisarlo?", you: "Proponé un día y una hora.", hint: ["How about Thursday at ten?", "Next Monday works for me."], model: ["How about Thursday at ten?", "Next Monday at three works for me."], expect: [R("\\b(monday|tuesday|wednesday|thursday|friday|next week|tomorrow|at NUM|o'?clock|morning|afternoon|\\d+)\\b")], slot: { day: R("\\b(monday|tuesday|wednesday|thursday|friday|tomorrow)\\b") }, next: "end" },
        end: { say: "{day|That} works for me. I'll send the invite. Thanks, everyone!", es: "Me queda bien. Mando la invitación. ¡Gracias a todos!", end: true }
      }
    },
    {
      id: "interview", title: "Entrevista sobre una campaña", sub: "Un periodista te pregunta por tu trabajo", level: "B1",
      who: { name: "Tom", role: "periodista", tone: "m", accent: "UK" },
      intro: "Tom escribe para un medio internacional y te entrevista sobre una campaña de comunicación pública.",
      start: "start",
      turns: {
        start: { say: "Thanks for taking the time. Can you tell me what the campaign is about?", es: "Gracias por tu tiempo. ¿Me contás de qué se trata la campaña?", you: "Explicá de qué se trata, en una o dos frases.", hint: ["It's about …", "The goal is to …"], model: ["It's about road safety. The goal is to reduce accidents.", "It's a campaign to help people report crimes online."], open: 4, next: "audience" },
        audience: { say: "Interesting. Who is it for? Who's the target audience?", es: "Interesante. ¿Para quién es? ¿Cuál es el público?", you: "Decí a quién está dirigida.", hint: ["It's for young people.", "Our audience is …"], model: ["It's for young people between eighteen and thirty.", "Our audience is families in big cities."], expect: [R("\\b(for|people|young|adults|families|parents|students|citizens|everyone|audience|aged|between|women|men)\\b")], next: "channels" },
        channels: { say: "And which channels are you using?", es: "¿Y qué canales usan?", you: "Nombrá los canales o las redes.", hint: ["We use Instagram, TikTok and …"], model: ["We use Instagram, TikTok and TV.", "Mainly social media and radio."], expect: [R("\\b(instagram|tik ?tok|facebook|twitter|youtube|tv|television|radio|social media|online|website|billboards|newspapers|x)\\b")], next: "results" },
        results: { say: "How is it going so far?", es: "¿Cómo viene hasta ahora?", you: "Contá un resultado.", hint: ["So far, …", "We've had …"], model: ["So far, we've had more than a million views.", "Very well. People are sharing it a lot."], open: 3, react: ["That's a great start.", "Good to hear."], next: "challenge" },
        challenge: { say: "What has been the biggest challenge?", es: "¿Cuál fue el mayor desafío?", you: "Contá el desafío principal.", hint: ["The biggest challenge was …"], model: ["The biggest challenge was the short time.", "Getting young people's attention."], open: 3, next: "future" },
        future: { say: "Last question. What's next for the campaign?", es: "Última pregunta. ¿Qué sigue para la campaña?", you: "Contá el próximo paso.", hint: ["Next month we're going to …", "We plan to …"], model: ["Next month we're going to launch a second stage.", "We plan to take it to schools."], open: 3, next: "end" },
        end: { say: "Great. Thank you so much for your time.", es: "Genial. Muchas gracias por tu tiempo.", end: true }
      }
    },
    {
      id: "cafe", title: "En la cafetería", sub: "Pedí algo para tomar y comer", level: "A2",
      who: { name: "Mia", role: "barista en Nueva York", tone: "f", accent: "US" },
      intro: "Entrás a una cafetería en Nueva York. Mia está detrás de la barra.",
      start: "start",
      turns: {
        start: { say: "Hi! What can I get for you today?", es: "¡Hola! ¿Qué te sirvo hoy?", you: "Pedí algo para tomar.", hint: ["Can I have a …, please?", "I'd like a …"], model: ["Can I have a latte, please?", "I'd like a cappuccino, please."], expect: [R("\\b(latte|coffee|cappuccino|flat white|americano|espresso|tea|mocha|hot chocolate|juice|water|cortado|macchiato)\\b")], slot: { drink: R("\\b(latte|coffee|cappuccino|flat white|americano|espresso|tea|mocha|hot chocolate|orange juice|juice|water|cortado|macchiato)\\b") }, next: "size" },
        size: { say: "Sure. What size would you like? Small, medium or large?", es: "Dale. ¿De qué tamaño? ¿Chico, mediano o grande?", you: "Elegí el tamaño.", hint: ["Medium, please.", "A small one."], model: ["Medium, please.", "A large one, please."], expect: [R("\\b(small|medium|large|big|regular|tall|grande)\\b")], next: "milk" },
        milk: { say: "Any milk with that? We have whole, skim and oat.", es: "¿Con leche? Tenemos entera, descremada y de avena.", you: "Decí qué leche querés, o que sin leche.", hint: ["Oat milk, please.", "No milk, thanks."], model: ["Oat milk, please.", "Whole milk is fine.", "No milk, thanks."], expect: [R("\\b(whole|skim|oat|oats|oak|out|almond|soy|regular|normal|milk|without|black|none|no|nope)\\b")], next: "else" },
        else: { say: "Great. Anything else? Our croissants are fresh today.", es: "Genial. ¿Algo más? Hoy los croissants están recién hechos.", you: "Pedí algo para comer o decí que nada más.", hint: ["Yes, a croissant, please.", "No, that's all, thanks."], model: ["Yes, I'll have a croissant, please.", "No, that's all, thanks."], expect: [R("\\b(yes|yeah|croissant|muffin|cookie|sandwich|cake|bagel|brownie|no|nothing|that'?s all|that'?s it)\\b")], next: "here" },
        here: { say: "Is that for here or to go?", es: "¿Es para tomar acá o para llevar?", you: "Decí si es para tomar acá o para llevar.", hint: ["For here, please.", "To go, please."], model: ["For here, please.", "To go, please."], expect: [R("\\b(here|to go|take ?away|take ?out|go)\\b")], next: "name" },
        name: { say: "And can I get a name for the order?", es: "¿Y me decís un nombre para el pedido?", you: "Decile tu nombre, y deletrealo si hace falta.", hint: ["It's Maxi.", "M, A, X, I."], model: ["It's Maxi. M, A, X, I.", "Maxi."], open: 1, slot: { name: R("(?:it'?s|it is|my name is|i'?m|name'?s)\\s+([a-z]+)") }, next: "pay" },
        pay: { say: "Thanks, {name}. That's eight fifty. Cash or card?", es: "Gracias. Son ocho con cincuenta. ¿Efectivo o tarjeta?", you: "Decí cómo vas a pagar.", hint: ["Card, please.", "Can I pay by card?"], model: ["Card, please.", "Can I pay with my phone?"], expect: [R("\\b(card|cash|phone|apple pay|google pay|credit|debit|contactless)\\b")], next: "end" },
        end: { say: "Perfect. Your {drink|order} will be ready in a minute. Have a nice day!", es: "Perfecto. Tu pedido sale en un minuto. ¡Que tengas un lindo día!", end: true }
      }
    },
    {
      id: "hotel", title: "Check-in en el hotel", sub: "Reserva, desayuno y wifi", level: "A2",
      who: { name: "Jake", role: "recepcionista", tone: "m", accent: "UK" },
      intro: "Llegás de noche a un hotel en Londres. Jake te atiende en la recepción.",
      start: "start",
      turns: {
        start: { say: "Good evening, welcome to the Riverside Hotel. Do you have a reservation?", es: "Buenas noches, bienvenido al Riverside Hotel. ¿Tiene una reserva?", you: "Decile que sí y a nombre de quién está.", hint: ["Yes, I have a reservation under …", "It's under the name …"], model: ["Yes, I have a reservation under the name Defranchi.", "Yes, it's under Maxi Defranchi."], expect: [R("\\b(yes|yeah|reservation|booking|booked|under|name)\\b")], next: "nights" },
        nights: { say: "Let me check. Yes, here it is. You're staying with us for three nights, is that right?", es: "Déjeme ver. Sí, acá está. Se queda tres noches, ¿correcto?", you: "Confirmá o corregí la cantidad de noches.", hint: ["Yes, that's right.", "Actually, it's four nights."], model: ["Yes, that's right.", "Actually, it's four nights."], expect: [R("\\b(yes|yeah|right|correct|that'?s it|no|actually|nights?|NUM)\\b")], next: "passport" },
        passport: { say: "Great. Could I see your passport, please?", es: "Perfecto. ¿Me muestra el pasaporte, por favor?", you: "Dale el pasaporte con una frase amable.", hint: ["Sure, here you are.", "Here it is."], model: ["Sure, here you are.", "Of course. Here it is."], expect: [R("\\b(here|sure|of course|yes|okay|ok)\\b")], next: "questions" },
        questions: { say: "Thank you. Do you have any questions about your stay?", es: "Gracias. ¿Tiene alguna pregunta sobre su estadía?", you: "Preguntá si el desayuno está incluido.", hint: ["Is breakfast included?", "What time is breakfast?"], model: ["Yes. Is breakfast included?", "Is breakfast included in the price?"], expect: [R("\\b(breakfast|included|what time)\\b")], next: "wifi_q" },
        wifi_q: { say: "Yes, it is. Breakfast is from seven to ten, on the first floor. Anything else?", es: "Sí. El desayuno es de siete a diez, en el primer piso. ¿Algo más?", you: "Preguntá por la contraseña del wifi.", hint: ["What's the wifi password?", "Is there wifi in the room?"], model: ["What's the wifi password?", "Is there free wifi?"], expect: [R("\\b(wi-? ?fi|wireless|internet|password)\\b")], next: "checkout" },
        checkout: { say: "The password is on your key card. Your room is five one two, on the fifth floor.", es: "La contraseña está en la tarjeta de la habitación. Su habitación es la 512, en el quinto piso.", you: "Agradecé y preguntá a qué hora es el check-out.", hint: ["Thank you. What time is check-out?"], model: ["Thank you. What time is check-out?", "Great, thanks. When is check-out?"], expect: [R("\\b(check-? ?out|leave|what time|when)\\b")], next: "end" },
        end: { say: "Check-out is at eleven. Enjoy your stay!", es: "El check-out es a las once. ¡Que disfrute su estadía!", end: true }
      }
    },
    {
      id: "airport", title: "Migraciones", sub: "Las preguntas del oficial en el aeropuerto", level: "A2",
      who: { name: "Officer Davis", role: "oficial de migraciones", tone: "m", accent: "US" },
      intro: "Llegaste a Nueva York. Te toca pasar por migraciones.",
      start: "start",
      turns: {
        start: { say: "Good afternoon. Passport, please.", es: "Buenas tardes. Pasaporte, por favor.", you: "Entregá el pasaporte con una frase.", hint: ["Here you are.", "Good afternoon. Here it is."], model: ["Good afternoon. Here you are.", "Here it is."], expect: [R("\\b(here|sure|yes|okay|ok|good afternoon|hello|hi)\\b")], next: "purpose" },
        purpose: { say: "What's the purpose of your visit?", es: "¿Cuál es el motivo de su visita?", you: "Decí si viajás por trabajo o por turismo.", hint: ["I'm here on business.", "I'm here on vacation."], model: ["I'm here on business. I have a conference.", "Tourism. I'm on vacation."], expect: [R("\\b(business|work|conference|meeting|tourism|tourist|vacation|holiday|visit|visiting|family|friends)\\b")], next: "long" },
        long: { say: "How long are you staying?", es: "¿Cuánto tiempo se queda?", you: "Decí cuántos días o semanas.", hint: ["For … days.", "One week."], model: ["For ten days.", "Just one week."], expect: [R("\\b(NUM|days?|weeks?|months?)\\b")], next: "stay" },
        stay: { say: "Where will you be staying?", es: "¿Dónde se va a alojar?", you: "Decí dónde te vas a quedar.", hint: ["At the … hotel.", "With a friend in …"], model: ["At the Hilton in Manhattan.", "At a friend's apartment in Brooklyn."], expect: [R("\\b(hotel|at|with|friend|apartment|airbnb|house|in)\\b")], next: "job" },
        job: { say: "And what do you do for a living?", es: "¿Y a qué se dedica?", you: "Decí tu trabajo.", hint: ["I work in …", "I'm a …"], model: ["I work in communications for the government.", "I'm a lawyer, but I work in communications."], expect: [R("\\b(i work|i'?m a|i am a|communications?|government|lawyer|manager|work|job)\\b")], next: "ticket" },
        ticket: { say: "Do you have a return ticket?", es: "¿Tiene pasaje de vuelta?", you: "Respondé que sí y cuándo volvés.", hint: ["Yes, I'm flying back on …"], model: ["Yes, I'm flying back on the twentieth.", "Yes, here it is."], expect: [R("\\b(yes|yeah|return|back|ticket|here|flying|flight)\\b")], next: "end" },
        end: { say: "Thank you. Enjoy your stay.", es: "Gracias. Que disfrute su estadía.", end: true }
      }
    },
    {
      id: "street", title: "Pedir indicaciones", sub: "Cómo llegar a la estación", level: "A2",
      who: { name: "Liam", role: "vecino que te ve perdido", tone: "m", accent: "UK" },
      intro: "Estás buscando la estación de tren y no la encontrás. Un vecino se acerca.",
      start: "start",
      turns: {
        start: { say: "Hi, you look a bit lost. Can I help you?", es: "Hola, parecés un poco perdido. ¿Te ayudo?", you: "Preguntá cómo llegar a la estación más cercana.", hint: ["Yes, please. How do I get to …?", "Where is the nearest station?"], model: ["Yes, please. Where is the nearest train station?", "How do I get to the station?"], expect: [R("\\b(station|subway|metro|underground|tube|train|how do i get|where is|where'?s)\\b")], next: "dir" },
        dir: { say: "Sure. Go straight ahead, then take the second street on the left. The station is next to a big bank.", es: "Claro. Seguí derecho y doblá en la segunda calle a la izquierda. La estación está al lado de un banco grande.", you: "Repetí las indicaciones para confirmar.", hint: ["So, straight ahead and second left?", "Second street on the left, right?"], model: ["So, straight ahead and then the second street on the left?", "Okay, second left, next to the bank."], expect: [R("\\b(straight|second|left|bank|okay|ok|so)\\b")], next: "far" },
        far: { say: "Exactly, you've got it!", es: "¡Exacto, lo tenés!", you: "Preguntá si queda lejos o cuánto se tarda caminando.", hint: ["Is it far?", "How long does it take to walk?"], model: ["Is it far from here?", "How long does it take on foot?"], expect: [R("\\b(far|how long|minutes|walk|walking|on foot|near|close)\\b")], next: "thanks" },
        thanks: { say: "Not at all. It's about five minutes on foot.", es: "Para nada. Son unos cinco minutos caminando.", you: "Agradecé.", hint: ["Thank you so much!", "Thanks a lot. Have a nice day."], model: ["Thank you so much!", "Thanks a lot. Have a nice day!"], expect: [R("\\b(thank|thanks|cheers|appreciate|great|perfect)\\b")], next: "end" },
        end: { say: "No problem. Have a good one!", es: "No hay problema. ¡Que andes bien!", end: true }
      }
    },
    {
      id: "weekend", title: "El fin de semana", sub: "Charla de lunes con una compañera", level: "A2+",
      who: { name: "Nora", role: "compañera de trabajo", tone: "f", accent: "US" },
      intro: "Es lunes a la mañana. Nora te pregunta por tu fin de semana. Practicá el pasado.",
      start: "start",
      turns: {
        start: { say: "Hey! How was your weekend?", es: "¡Hola! ¿Qué tal tu fin de semana?", you: "Decí cómo estuvo.", hint: ["It was great!", "It was quiet, but nice."], model: ["It was great, thanks!", "It was quiet, but nice."], expect: [R("\\b(it was|good|great|nice|fine|okay|ok|amazing|relaxing|quiet|busy|boring|fun|terrible|not bad|lovely)\\b")], next: "what" },
        what: { say: "Nice! What did you do?", es: "¡Qué bien! ¿Qué hiciste?", you: "Contá qué hiciste, en pasado.", hint: ["I went to …", "I visited …", "I stayed home and …"], model: ["I went to a football match with my friends.", "I stayed home and watched a series."], open: 3, react: ["Sounds fun!", "Oh, nice."], next: "else" },
        else: { say: "Did you do anything else?", es: "¿Hiciste algo más?", you: "Contá otra cosa que hiciste.", hint: ["I also …", "On Sunday I …"], model: ["On Sunday I had lunch with my family.", "I also went for a run in the park."], open: 3, next: "food" },
        food: { say: "Did you eat anything good?", es: "¿Comiste algo rico?", you: "Contá qué comiste.", hint: ["Yes, I had …", "We made …"], model: ["Yes, I had an amazing asado.", "We made pizza at home."], open: 2, react: ["Yum!", "That sounds delicious."], next: "plans" },
        plans: { say: "And what are your plans for next weekend?", es: "¿Y qué planes tenés para el próximo fin de semana?", you: "Contá tus planes, con «going to» o «will».", hint: ["I'm going to …", "I think I'll …"], model: ["I'm going to visit my parents.", "I think I'll go to the movies."], expect: [R("\\b(going to|gonna|will|i'?ll|plan|planning|want to|would like|maybe|probably|nothing|not sure)\\b")], next: "end" },
        end: { say: "Sounds great. Well, back to work. See you at lunch!", es: "Suena bárbaro. Bueno, a trabajar. ¡Nos vemos en el almuerzo!", end: true }
      }
    },
    {
      id: "phone", title: "Reservar por teléfono", sub: "Una mesa en un restaurante", level: "A2",
      who: { name: "Luigi's", role: "restaurante italiano", tone: "m", accent: "US" },
      intro: "Llamás a un restaurante para reservar una mesa.",
      start: "start",
      turns: {
        start: { say: "Good evening, Luigi's. How can I help you?", es: "Buenas noches, Luigi's. ¿En qué lo puedo ayudar?", you: "Decí que querés reservar una mesa.", hint: ["I'd like to book a table, please.", "Can I make a reservation?"], model: ["Hi, I'd like to book a table, please.", "Hello, can I make a reservation for tonight?"], expect: [R("\\b(book|reserve|reservation|table)\\b")], next: "people" },
        people: { say: "Of course. For how many people?", es: "Claro. ¿Para cuántas personas?", you: "Decí cuántas personas.", hint: ["For two, please.", "A table for four."], model: ["For two people, please.", "A table for four."], expect: [R("\\b(NUM|people|persons|us|couple)\\b")], next: "when" },
        when: { say: "And for what day and time?", es: "¿Y para qué día y hora?", you: "Decí el día y la hora.", hint: ["Tonight at eight.", "Friday at nine, please."], model: ["Tonight at eight, please.", "This Friday at nine."], expect: [R("\\b(tonight|today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|at NUM|NUM|o'?clock|pm|evening)\\b")], next: "name" },
        name: { say: "Let me check. Yes, we have a table. Can I have a name for the reservation?", es: "Déjeme ver. Sí, tenemos mesa. ¿A nombre de quién?", you: "Decí tu nombre.", hint: ["It's under …", "My name is …"], model: ["It's under Maxi. M, A, X, I.", "My name is Maxi Defranchi."], open: 1, next: "number" },
        number: { say: "Thank you. And a phone number, please?", es: "Gracias. ¿Y un número de teléfono?", you: "Decí un número en inglés. Podés inventarlo.", hint: ["It's five five five, one two three, four five six seven."], model: ["Sure, it's five five five, one two three, four five six seven."], expect: [R("\\b(\\d|zero|oh|one|two|three|four|five|six|seven|eight|nine)\\b")], next: "allergy" },
        allergy: { say: "Perfect. Does anyone in your group have any allergies?", es: "Perfecto. ¿Alguien del grupo tiene alergias?", you: "Respondé si hay alergias.", hint: ["No, no allergies.", "Yes, I'm allergic to …"], model: ["No, no allergies. Thank you.", "Yes, my wife is allergic to nuts."], expect: [R("\\b(no|none|nobody|yes|allergic|allergy|allergies|gluten|nuts|lactose|seafood)\\b")], next: "end" },
        end: { say: "Great, you're all set. See you soon!", es: "Listo, quedó reservado. ¡Lo esperamos!", end: true }
      }
    },
    {
      id: "restaurant", title: "En el restaurante", sub: "Pedí, reclamá un plato y pagá", level: "A2+",
      who: { name: "Daniel", role: "mozo en Chicago", tone: "m", accent: "US" },
      intro: "Cenás en un restaurante de Chicago. Daniel es el mozo.",
      start: "start",
      turns: {
        start: { say: ["Good evening! Are you ready to order?", "Hi there! Have you decided what you'd like?"], es: "¡Buenas noches! ¿Ya sabés qué vas a pedir?", you: "Pedí un plato principal.", hint: ["I'd like the …, please.", "Can I have the …?"], model: ["I'd like the steak, please.", "Can I have the chicken salad?"], expect: [R("\\b(i'?d like|i would like|can i (have|get)|i'?ll have|i'?ll take|steak|chicken|fish|salmon|burger|pasta|salad|soup|pizza|ribs)\\b")], slot: { dish: R("\\b(steak|chicken salad|chicken|fish|salmon|burger|pasta|salad|soup|pizza|ribs)\\b") }, next: "cook" },
        cook: { say: "Good choice. How would you like it cooked? Rare, medium or well done?", es: "Buena elección. ¿Qué punto de cocción? ¿Jugoso, a punto o bien cocido?", you: "Elegí el punto, o decí que no hace falta.", hint: ["Medium, please.", "Well done, please."], model: ["Medium, please.", "Medium rare, please.", "It's not a steak, but thanks."], open: 1, next: "drink" },
        drink: { say: ["And what would you like to drink?", "Can I get you something to drink?"], es: "¿Y qué querés tomar?", you: "Pedí una bebida.", hint: ["Just water, please.", "A glass of red wine."], model: ["Just sparkling water, please.", "A Coke, please."], expect: [R("\\b(water|wine|beer|coke|soda|juice|lemonade|nothing|sparkling|still)\\b")], next: "problem" },
        problem: { say: "Here you are. Is everything okay with your meal?", es: "Acá tenés. ¿Está todo bien con tu plato?", you: "Algo está mal: reclamá con amabilidad (está frío, no es lo que pediste).", hint: ["Sorry, but it's a bit cold.", "Excuse me, I ordered the … not the …"], model: ["Sorry, but my food is a bit cold.", "Excuse me, I think this isn't what I ordered."], expect: [R("\\b(cold|wrong|not what|didn'?t order|ordered|salty|raw|overcooked|burnt|too|isn'?t|problem|sorry|excuse me)\\b")], next: "fix" },
        fix: { say: "Oh, I'm so sorry about that. I'll bring you a new one right away. Would you like anything while you wait?", es: "Uy, perdón. Ya te traigo uno nuevo. ¿Querés algo mientras esperás?", you: "Aceptá y respondé si querés algo más.", hint: ["No, thank you. That's fine.", "Some bread, please."], model: ["No, thanks. That's very kind.", "Could I have some bread, please?"], open: 1, next: "dessert" },
        dessert: { say: ["Would you like to see the dessert menu?", "Can I tempt you with some dessert?"], es: "¿Querés ver la carta de postres?", you: "Decí si querés postre o pedí la cuenta.", hint: ["No, thanks. Can I have the check, please?", "Yes, please."], model: ["No, thanks. Could we have the check, please?", "Yes, I'd love to see it."], expect: [R("\\b(yes|no|check|bill|dessert|please|thanks|cake|ice cream)\\b")], next: "pay" },
        pay: { say: "Here's your check. Are you paying together or separately?", es: "Acá está la cuenta. ¿Pagan juntos o separado?", you: "Decí cómo pagás. Ojo: en Estados Unidos se deja propina.", hint: ["Together, by card.", "Can I pay by card?"], model: ["Together, please. Can I pay by card?", "Separately, please."], expect: [R("\\b(together|separate|separately|card|cash|split)\\b")], next: "end" },
        end: { say: "Perfect. Thank you so much, and have a great night!", es: "Perfecto. ¡Muchas gracias y que tengas una linda noche!", end: true }
      }
    },
    {
      id: "hotelfix", title: "Un problema en el hotel", sub: "Tu reserva no aparece y el aire no anda", level: "B1",
      who: { name: "Grace", role: "recepcionista en Dublín", tone: "f", accent: "UK" },
      intro: "Llegás a tu hotel en Dublín, cansado del viaje. Grace no encuentra tu reserva.",
      start: "start",
      turns: {
        start: { say: "Hello, welcome. I'm sorry, but I can't find your reservation. What name is it under?", es: "Hola, bienvenido. Perdón, pero no encuentro tu reserva. ¿A nombre de quién está?", you: "Dale tu nombre y deletrealo.", hint: ["It's under Defranchi. D, E, F…", "My name is …"], model: ["It's under Defranchi. D-E-F-R-A-N-C-H-I.", "My name is Maxi Defranchi."], open: 1, slot: { name: R("(?:under|name is|i'?m|it'?s)\\s+([a-z]+)") }, next: "proof" },
        proof: { say: "I still don't see it. Do you have a confirmation email or number?", es: "Sigo sin verla. ¿Tenés un mail o un número de confirmación?", you: "Decí que sí y ofrecé mostrarlo.", hint: ["Yes, I have it on my phone.", "Let me show you."], model: ["Yes, I have the confirmation email on my phone. Let me show you.", "Yes, the number is four, five, two, eight."], expect: [R("\\b(yes|yeah|email|e-mail|phone|number|show|here|confirmation|booking)\\b")], next: "found" },
        found: { say: "Ah, there it is. It was booked for tomorrow by mistake. Don't worry, I have a room for you tonight. How many nights are you staying?", es: "Ah, ahí está. Se reservó para mañana por error. Tranquilo, tengo una habitación para hoy. ¿Cuántas noches te quedás?", you: "Decí cuántas noches.", hint: ["Three nights.", "Until Friday."], model: ["Three nights, until Friday.", "Four nights, please."], expect: [R("\\b(NUM|night|nights|until|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week)\\b")], next: "later" },
        later: { say: "You're all set. Room 412. Let me know if you need anything.", es: "Listo. Habitación 412. Avisame si necesitás algo.", you: "Pasaron unas horas: llamá a recepción y decí que el aire acondicionado no funciona.", hint: ["Hi, I'm in room 412. The air conditioning doesn't work.", "There's a problem with …"], model: ["Hi, this is room four twelve. The air conditioning isn't working.", "Sorry to bother you, but the AC doesn't work."], expect: [R("\\b(air|conditioning|ac|a\\.c\\.|heating|doesn'?t work|isn'?t working|not working|broken|problem|hot)\\b")], next: "offer" },
        offer: { say: "I'm sorry about that. I can send someone up now, or move you to another room. What would you prefer?", es: "Perdón por eso. Puedo mandar a alguien ahora o cambiarte de habitación. ¿Qué preferís?", you: "Elegí una opción.", hint: ["I'd prefer another room, please.", "Please send someone."], model: ["I'd prefer to move to another room, please.", "Could you send someone now, please?"], expect: [R("\\b(move|another|change|different|send|someone|technician|fix|prefer|room)\\b")], next: "end" },
        end: { say: "No problem at all. It'll be sorted in ten minutes. Sorry again for the trouble.", es: "Ningún problema. En diez minutos queda resuelto. Perdón otra vez por la molestia.", end: true }
      }
    },
    {
      id: "flight", title: "Vuelo cancelado", sub: "Reclamá y conseguí otro vuelo", level: "B1",
      who: { name: "Kevin", role: "agente de la aerolínea en Miami", tone: "m", accent: "US" },
      intro: "Tu vuelo de Miami a Buenos Aires se canceló. Hacés la fila y te atiende Kevin.",
      start: "start",
      turns: {
        start: { say: ["Next, please. How can I help you?", "Hi, next in line. What can I do for you?"], es: "El que sigue. ¿En qué te ayudo?", you: "Explicá que se canceló tu vuelo.", hint: ["My flight was cancelled.", "My flight to Buenos Aires was cancelled."], model: ["Hi. My flight to Buenos Aires was cancelled.", "My flight was cancelled and I need to get home."], expect: [R("\\b(cancel+ed|cancel|flight|delayed|buenos aires)\\b")], next: "pass" },
        pass: { say: "I'm sorry about that. Can I see your passport and boarding pass?", es: "Lo siento. ¿Me mostrás el pasaporte y la tarjeta de embarque?", you: "Entregalos.", hint: ["Sure, here you are.", "Here they are."], model: ["Sure, here you are.", "Of course. Here they are."], expect: [R("\\b(here|sure|of course|yes|okay|ok)\\b")], next: "options" },
        options: { say: "The next flight with seats is tomorrow at nine p.m. Or there's one tonight with a stop in Panama. Which one works better for you?", es: "El próximo vuelo con lugar es mañana a las 21. O hay uno esta noche con escala en Panamá. ¿Cuál te conviene?", you: "Elegí y explicá por qué.", hint: ["The one tonight, please. I need to be at work tomorrow.", "Tomorrow is fine."], model: ["I'll take the one tonight, please. I have to work on Monday.", "Tomorrow is fine, but where will I sleep?"], expect: [R("\\b(tonight|tomorrow|panama|stop|direct|first|second|one|take)\\b")], branch: [{ if: R("\\b(tomorrow)\\b"), to: "hotel" }], next: "bags" },
        hotel: { say: "Okay. Since the cancellation was our fault, we'll give you a hotel voucher and a meal voucher. Do you have checked luggage?", es: "Bien. Como la cancelación fue culpa nuestra, te damos un voucher de hotel y otro de comida. ¿Despachaste valijas?", you: "Respondé por tu equipaje.", hint: ["Yes, one suitcase.", "No, just a carry-on."], model: ["Yes, one suitcase. Will it go on the new flight?", "No, only a carry-on bag."], expect: [R("\\b(yes|no|suitcase|bag|bags|luggage|carry|one|two)\\b")], next: "end" },
        bags: { say: "Done, you're booked. Your bag will be transferred automatically. Is there anything else I can help you with?", es: "Listo, ya estás reservado. Tu valija se transfiere sola. ¿Algo más?", you: "Preguntá por la conexión o por comida, o agradecé.", hint: ["How long is the stop in Panama?", "Can I get a meal voucher?"], model: ["How long is the connection in Panama?", "No, that's all. Thank you for your help."], open: 1, next: "end" },
        end: { say: "Here's your new boarding pass. Again, sorry for the inconvenience. Have a safe trip!", es: "Acá tenés la nueva tarjeta de embarque. Perdón de nuevo por las molestias. ¡Buen viaje!", end: true }
      }
    },
    {
      id: "pharmacy", title: "En la farmacia", sub: "Explicá un síntoma y entendé la dosis", level: "A2+",
      who: { name: "Linda", role: "farmacéutica en Toronto", tone: "f", accent: "US" },
      intro: "Estás de viaje en Toronto y te duele la garganta. Entrás a una farmacia.",
      start: "start",
      turns: {
        start: { say: ["Hi, how can I help you today?", "Hello! What can I do for you?"], es: "Hola, ¿en qué te ayudo?", you: "Decí qué te pasa.", hint: ["I have a sore throat.", "My throat hurts."], model: ["Hi. I have a sore throat and a bit of a fever.", "My throat hurts a lot."], expect: [R("\\b(sore|throat|hurts|pain|headache|fever|cold|cough|flu|stomach|feel|sick|ill)\\b")], next: "since" },
        since: { say: "Oh, I'm sorry to hear that. How long have you had it?", es: "Uh, lo siento. ¿Desde cuándo lo tenés?", you: "Decí desde cuándo. Ojo: «for two days», no «since two days».", hint: ["For two days.", "Since yesterday."], model: ["For two days.", "Since yesterday morning."], expect: [R("\\b(for|since|days|day|yesterday|morning|night|week|today|NUM)\\b")], next: "allergy" },
        allergy: { say: "Are you allergic to any medication?", es: "¿Sos alérgico a algún medicamento?", you: "Respondé.", hint: ["No, I'm not.", "Yes, I'm allergic to penicillin."], model: ["No, I'm not allergic to anything.", "Yes, I'm allergic to penicillin."], expect: [R("\\b(no|not|yes|allergic|penicillin|aspirin|ibuprofen|nothing)\\b")], next: "dose" },
        dose: { say: "Okay. These lozenges will help. Take one every four hours, but no more than six a day. Is that clear?", es: "Bien. Estas pastillas te van a ayudar. Una cada cuatro horas, pero no más de seis por día. ¿Está claro?", you: "Confirmá repitiendo la dosis, o pedí que te repita.", hint: ["One every four hours, max six a day.", "Sorry, can you repeat that?"], model: ["Yes. One every four hours, and no more than six a day.", "Sorry, could you say that again more slowly?"], expect: [R("\\b(every|four|hours|six|yes|clear|got it|okay|ok|repeat|again)\\b")], next: "pay" },
        pay: { say: "Perfect. That'll be twelve dollars. And if you don't feel better in three days, please see a doctor.", es: "Perfecto. Son doce dólares. Y si en tres días no mejorás, andá al médico.", you: "Agradecé y pagá.", hint: ["Thank you. Here you are.", "Can I pay by card?"], model: ["Thank you very much. Can I pay by card?", "Thanks for your help."], open: 1, next: "end" },
        end: { say: "Of course. Get well soon!", es: "Claro. ¡Que te mejores!", end: true }
      }
    },
    {
      id: "shop", title: "De compras", sub: "Talles, probador y un cambio", level: "A2",
      who: { name: "Olivia", role: "vendedora en una tienda de ropa", tone: "f", accent: "US" },
      intro: "Estás en una tienda de ropa en Nueva York buscando una campera.",
      start: "start",
      turns: {
        start: { say: ["Hi! Are you looking for anything in particular?", "Hello! Can I help you find something?"], es: "¡Hola! ¿Buscás algo en particular?", you: "Decí qué buscás.", hint: ["I'm looking for a jacket.", "Yes, a … for …"], model: ["Yes, I'm looking for a light jacket.", "I need a shirt for work."], expect: [R("\\b(looking for|jacket|shirt|shoes|pants|jeans|sweater|coat|t-shirt|need|want|just looking|browsing)\\b")], next: "size" },
        size: { say: "We have some nice ones over here. What size are you?", es: "Tenemos unas lindas por acá. ¿Qué talle sos?", you: "Decí tu talle.", hint: ["I'm a medium.", "Large, I think."], model: ["I'm usually a medium.", "Large, I think."], expect: [R("\\b(small|medium|large|extra|xl|size|NUM)\\b")], next: "try" },
        try: { say: "Here's a medium in blue and in black. Would you like to try them on?", es: "Acá tenés un mediano en azul y en negro. ¿Te los querés probar?", you: "Decí que sí y preguntá dónde está el probador.", hint: ["Yes, please. Where are the fitting rooms?", "Can I try the black one?"], model: ["Yes, please. Where are the fitting rooms?", "Can I try on the black one?"], expect: [R("\\b(yes|try|fitting|changing|room|black|blue|sure|please)\\b")], next: "fit" },
        fit: { say: "How does it fit?", es: "¿Cómo te queda?", you: "Decí cómo te queda.", hint: ["It's a bit small.", "It fits perfectly."], model: ["It's a little tight. Do you have a large?", "It fits perfectly. I'll take it."], expect: [R("\\b(fits|fit|small|big|tight|loose|large|perfect|good|great|take it|long|short)\\b")], branch: [{ if: R("\\b(small|tight|short|large\\?)\\b"), to: "bigger" }], next: "pay" },
        bigger: { say: "Let me get you a large. Here you go. Better?", es: "Te traigo un grande. Acá está. ¿Mejor?", you: "Decí que sí y que te lo llevás.", hint: ["Yes, much better. I'll take it.", "Perfect, thanks."], model: ["Yes, much better. I'll take it.", "Perfect. How much is it?"], open: 1, next: "pay" },
        pay: { say: "Great choice. It's eighty-nine dollars. Would you like a gift receipt, in case you need to exchange it?", es: "Buena elección. Son 89 dólares. ¿Querés un ticket de cambio por si lo tenés que cambiar?", you: "Respondé y preguntá hasta cuándo se puede cambiar.", hint: ["Yes, please. How long do I have to exchange it?", "No, thanks."], model: ["Yes, please. How many days do I have to return it?", "No, thank you. Can I pay by card?"], open: 1, next: "end" },
        end: { say: "You have thirty days with the receipt. Thanks for shopping with us!", es: "Tenés treinta días con el ticket. ¡Gracias por tu compra!", end: true }
      }
    },
    {
      id: "taxi", title: "En el taxi", sub: "Dale la dirección y charlá con el chofer", level: "A2",
      who: { name: "Tony", role: "taxista en Nueva York", tone: "m", accent: "US" },
      intro: "Salís del aeropuerto JFK y te subís a un taxi. Tony maneja.",
      start: "start",
      turns: {
        start: { say: ["Hey there! Where are you headed?", "Hi! Where to?"], es: "¡Hola! ¿A dónde vas?", you: "Dale la dirección del hotel.", hint: ["To the Hilton on 6th Avenue, please.", "Can you take me to …?"], model: ["To the Hilton hotel on Sixth Avenue, please.", "Can you take me to this address, please?"], expect: [R("\\b(to|hotel|avenue|street|address|downtown|take me|please|manhattan)\\b")], next: "time" },
        time: { say: "Sure thing. With this traffic, it'll take about forty minutes. Is that okay?", es: "Dale. Con este tránsito son unos cuarenta minutos. ¿Está bien?", you: "Respondé y preguntá cuánto sale más o menos.", hint: ["That's fine. How much will it be?", "Okay, no problem."], model: ["That's fine. How much will it cost, more or less?", "No problem. Can I pay by card?"], open: 1, next: "chat" },
        chat: { say: "Around seventy bucks with the tolls. So, first time in New York?", es: "Unos setenta dólares con los peajes. ¿Primera vez en Nueva York?", you: "Respondé y contá de dónde sos.", hint: ["Yes, I'm from Argentina.", "No, I came in …"], model: ["Yes, it's my first time. I'm from Buenos Aires.", "No, I was here five years ago."], expect: [R("\\b(yes|no|first|time|argentina|buenos aires|came|was here|before)\\b")], next: "why" },
        why: { say: ["Nice! Are you here for work or for fun?", "Cool. Business or pleasure?"], es: "¡Qué bueno! ¿Venís por trabajo o de paseo?", you: "Contá a qué venís.", hint: ["For work. I have a conference.", "On vacation."], model: ["For work. I have some meetings this week.", "Just for fun. I'm on vacation."], expect: [R("\\b(work|business|conference|meeting|meetings|vacation|holiday|fun|pleasure|visit|both)\\b")], next: "stop" },
        stop: { say: "Here we are. Do you want me to stop here or at the main entrance?", es: "Llegamos. ¿Te dejo acá o en la entrada principal?", you: "Elegí dónde bajarte y pedí un recibo.", hint: ["Here is fine. Can I get a receipt?", "At the main entrance, please."], model: ["Right here is fine. Can I have a receipt, please?", "At the main entrance, please."], expect: [R("\\b(here|entrance|fine|receipt|stop|corner|door)\\b")], next: "end" },
        end: { say: "Here's your receipt. Enjoy the city!", es: "Acá tenés el recibo. ¡Disfrutá la ciudad!", end: true }
      }
    },
    {
      id: "pitch", title: "Presentar resultados", sub: "Contale a un equipo extranjero cómo salió una campaña", level: "B1",
      who: { name: "Rachel", role: "directora de comunicación en Washington", tone: "f", accent: "US" },
      intro: "Videollamada con un equipo de comunicación de otro país. Rachel te pide que presentes los resultados de una campaña.",
      start: "start",
      turns: {
        start: { say: "Thanks for joining us. We heard your campaign did really well. Can you tell us what it was about?", es: "Gracias por sumarte. Escuchamos que tu campaña funcionó muy bien. ¿De qué se trataba?", you: "Explicá de qué fue la campaña.", hint: ["It was a campaign about …", "The goal was to …"], model: ["Sure. It was a campaign about road safety for young people.", "The goal was to explain a new public service in a simple way."], expect: [R("\\b(campaign|about|goal|aim|objective|was|we|people|explain|inform|safety|security)\\b")], next: "results" },
        results: { say: ["Interesting. And what were the main results?", "Great. What numbers can you share with us?"], es: "Interesante. ¿Cuáles fueron los resultados principales?", you: "Dá un par de números.", hint: ["We reached … people.", "Engagement grew by … percent."], model: ["We reached five million people in three weeks.", "Engagement grew by forty percent compared to last year."], expect: [R("\\b(NUM|million|thousand|percent|%|reached|views|grew|increased|engagement|followers|people)\\b")], next: "channel" },
        channel: { say: "Impressive. Which channel worked best?", es: "Impresionante. ¿Qué canal funcionó mejor?", you: "Decí qué canal y por qué.", hint: ["Instagram worked best, because …", "Short videos on TikTok."], model: ["Short videos on Instagram worked best, because young people watch them every day.", "TikTok, because the content was simple and fast."], expect: [R("\\b(instagram|tiktok|youtube|x|twitter|facebook|whatsapp|tv|radio|video|videos|reels|social|because)\\b")], next: "learn" },
        learn: { say: "What would you do differently next time?", es: "¿Qué harías distinto la próxima vez?", you: "Contá una lección. Usá «I would…».", hint: ["I would start earlier.", "I would test more creative ideas."], model: ["I would start the campaign earlier and test more ideas.", "Next time, I would invest more in video."], expect: [R("\\b(would|'d|next time|earlier|more|less|better|change|test|invest)\\b")], next: "end" },
        end: { say: "That's really useful. Could you send us the slides after the call? Thanks a lot!", es: "Muy útil. ¿Nos mandás las diapositivas después de la llamada? ¡Muchas gracias!", end: true }
      }
    },
    {
      id: "disagree", title: "No estoy de acuerdo", sub: "Defendé tu idea en una reunión", level: "B1",
      who: { name: "Mark", role: "jefe de marketing", tone: "m", accent: "UK" },
      intro: "En una reunión, Mark propone algo que no te convence. Tenés que defender tu idea con respeto.",
      start: "start",
      turns: {
        start: { say: "I think we should stop posting videos and focus only on photos. They're cheaper. What do you think?", es: "Creo que tendríamos que dejar los videos y hacer solo fotos. Son más baratas. ¿Qué pensás?", you: "Decí con respeto que no estás de acuerdo.", hint: ["I see your point, but I don't agree.", "I'm not sure that's a good idea."], model: ["I see your point, but I don't agree. Videos get much more engagement.", "I understand, but I'm not sure that's a good idea."], expect: [R("\\b(don'?t agree|disagree|not sure|see your point|understand|but|however|i think)\\b")], next: "why" },
        why: { say: "Why not? Photos are much easier to produce.", es: "¿Por qué no? Las fotos son mucho más fáciles de producir.", you: "Dá una razón con un dato.", hint: ["Because videos get more views.", "Our data shows that …"], model: ["Because our videos get three times more views than photos.", "Our data shows that people share videos more."], expect: [R("\\b(because|data|numbers|views|engagement|share|more|reach|people|audience|algorithm)\\b")], next: "budget" },
        budget: { say: ["Okay, but our budget is smaller this year.", "Fair enough, but we have less money this year."], es: "Bien, pero este año el presupuesto es más chico.", you: "Proponé una solución intermedia.", hint: ["What if we make shorter videos?", "We could …"], model: ["What if we make shorter videos with our own phones?", "We could do fewer videos, but better ones."], expect: [R("\\b(what if|we could|maybe|how about|why don'?t we|let'?s|shorter|fewer|cheaper|phone|own|instead)\\b")], next: "agree" },
        agree: { say: "Hmm, that could work. Can you prepare a plan for next week?", es: "Mmm, eso puede funcionar. ¿Podés preparar un plan para la semana que viene?", you: "Aceptá y decí cuándo lo mandás.", hint: ["Sure, I'll send it on Monday.", "Of course."], model: ["Sure. I'll send it to you on Monday.", "Of course. I'll have it ready by Friday."], expect: [R("\\b(sure|of course|yes|okay|ok|send|ready|monday|tuesday|wednesday|thursday|friday|will|'ll)\\b")], next: "end" },
        end: { say: "Great. Thanks for pushing back, it was a good discussion.", es: "Genial. Gracias por discutirlo, fue una buena charla.", end: true }
      }
    },
    {
      id: "press", title: "Entrevista de prensa", sub: "Preguntas incómodas de un periodista", level: "B1",
      who: { name: "James", role: "periodista de una agencia internacional", tone: "m", accent: "UK" },
      intro: "Un periodista extranjero te para a la salida de un evento. Respondé corto, claro y sin perder la calma.",
      start: "start",
      turns: {
        start: { say: "Excuse me, do you have a minute for a quick question?", es: "Disculpá, ¿tenés un minuto para una pregunta rápida?", you: "Aceptá, pero marcá que tenés poco tiempo.", hint: ["Sure, but just a minute.", "Yes, go ahead."], model: ["Sure, but I only have a couple of minutes.", "Yes, go ahead."], expect: [R("\\b(sure|yes|go ahead|okay|ok|minute|quick|of course)\\b")], next: "q1" },
        q1: { say: "Some people say the new policy is not working. What's your answer to that?", es: "Algunos dicen que la nueva política no está funcionando. ¿Qué respondés?", you: "Respondé con un dato, sin enojarte.", hint: ["The numbers show that …", "I understand the concern, but …"], model: ["I understand the concern, but the official numbers show a clear improvement.", "The data says something different. Crime went down this year."], expect: [R("\\b(numbers|data|show|shows|understand|but|official|improve|improvement|down|better|results)\\b")], next: "q2" },
        q2: { say: ["But isn't it too early to talk about results?", "Still, isn't it a bit early to celebrate?"], es: "¿Pero no es muy pronto para hablar de resultados?", you: "Reconocé algo y reafirmá tu punto.", hint: ["It's true that …, but …", "Of course there's work to do, but …"], model: ["Of course there's still a lot of work to do, but the trend is clear.", "It's true that it's early, but the first results are very positive."], expect: [R("\\b(true|of course|work to do|but|early|still|trend|first|positive|results)\\b")], next: "q3" },
        q3: { say: "One last question. What's the next step?", es: "Una última. ¿Cuál es el próximo paso?", you: "Contá el próximo paso en una frase, con futuro.", hint: ["Next month we're going to …", "We will …"], model: ["Next month we're going to launch a new campaign to explain it.", "We will publish a full report in December."], expect: [R("\\b(going to|will|'ll|next|plan|launch|publish|month|year|soon)\\b")], next: "end" },
        end: { say: "Thank you for your time.", es: "Gracias por tu tiempo.", end: true }
      }
    },
    {
      id: "agency", title: "Con la agencia", sub: "Pedí cambios y acordá un plazo", level: "B1",
      who: { name: "Sophie", role: "productora de una agencia de diseño", tone: "f", accent: "UK" },
      intro: "Una agencia te mandó un video para una campaña. Hay que pedir cambios y cerrar fechas.",
      start: "start",
      turns: {
        start: { say: "Hi! Did you have a chance to watch the video we sent?", es: "¡Hola! ¿Pudiste ver el video que te mandamos?", you: "Decí que sí y qué te pareció en general.", hint: ["Yes, I did. It looks great, but …", "Yes, overall I like it."], model: ["Yes, I did. Overall it looks great, but we need some changes.", "Yes. I like it, but there are a few things to fix."], expect: [R("\\b(yes|watched|saw|did|like|great|good|but|changes|fix)\\b")], next: "changes" },
        changes: { say: "Sure. What would you like us to change?", es: "Claro. ¿Qué querés que cambiemos?", you: "Pedí dos cambios con «Could you…?».", hint: ["Could you make the text bigger?", "Could you change the music?"], model: ["Could you make the text bigger and change the music?", "Could you shorten it to thirty seconds?"], expect: [R("\\b(could you|can you|would you|change|bigger|smaller|shorter|music|text|color|logo|faster|slower|cut)\\b")], next: "when" },
        when: { say: "No problem. We can have a new version in about a week. Does that work for you?", es: "No hay problema. Podemos tener una versión nueva en una semana. ¿Te sirve?", you: "Pedí que sea antes y explicá por qué.", hint: ["That's too late. We need it by Thursday.", "Could you do it faster?"], model: ["Sorry, but that's too late. We need it by Thursday because the campaign starts on Monday.", "Could you send it a bit earlier? We're launching soon."], expect: [R("\\b(late|need|by|earlier|sooner|faster|thursday|wednesday|friday|monday|tuesday|because|launch|deadline)\\b")], next: "deal" },
        deal: { say: "Hmm, that's tight, but we'll try. Can you send me all the comments in writing today?", es: "Mmm, está justo, pero lo intentamos. ¿Me mandás todos los comentarios por escrito hoy?", you: "Confirmá y decí cuándo.", hint: ["Sure, I'll email you this afternoon.", "Of course."], model: ["Sure, I'll email them to you this afternoon.", "Of course. You'll have them in an hour."], expect: [R("\\b(sure|of course|yes|email|send|today|afternoon|hour|will|'ll)\\b")], next: "end" },
        end: { say: "Perfect. Talk soon!", es: "Perfecto. ¡Hablamos!", end: true }
      }
    },
    {
      id: "dinner", title: "Cena de trabajo", sub: "Small talk en un congreso", level: "A2+",
      who: { name: "Hannah", role: "colega canadiense en un congreso", tone: "f", accent: "US" },
      intro: "Cena después de un congreso de comunicación. Te toca al lado de Hannah.",
      start: "start",
      turns: {
        start: { say: ["So, what did you think of the conference today?", "How did you like the talks today?"], es: "¿Y qué te pareció el congreso hoy?", you: "Dá tu opinión.", hint: ["It was really interesting.", "I liked the talk about …"], model: ["It was really interesting. I loved the talk about artificial intelligence.", "Some talks were great, others were a bit long."], open: 1, next: "food" },
        food: { say: "Have you tried the food here? The fish is supposed to be amazing.", es: "¿Probaste la comida de acá? Dicen que el pescado es buenísimo.", you: "Respondé y compará con la comida de Argentina.", hint: ["Not yet. In Argentina we eat more meat.", "Yes, it's delicious."], model: ["Not yet. In Argentina we eat a lot more meat than fish.", "Yes, it's delicious, but I miss Argentine steak."], open: 1, next: "argentina" },
        argentina: { say: "I've always wanted to visit Argentina. What should I see in Buenos Aires?", es: "Siempre quise ir a Argentina. ¿Qué tengo que ver en Buenos Aires?", you: "Recomendale dos lugares con «You should…».", hint: ["You should visit …", "You should go to a parrilla."], model: ["You should visit San Telmo on Sunday and go to a parrilla.", "You should walk around Recoleta and see a tango show."], expect: [R("\\b(should|must|have to|visit|go|see|try|walk|recommend)\\b")], next: "hobby" },
        hobby: { say: ["That sounds great. What do you do when you're not working?", "And what do you like doing in your free time?"], es: "¡Suena genial! ¿Qué hacés cuando no trabajás?", you: "Contá tus hobbies. Ojo: «I like + -ing».", hint: ["I like reading and …", "I enjoy watching football."], model: ["I like reading, going to the gym and watching football.", "I enjoy walking around the city."], open: 1, next: "contact" },
        contact: { say: "We should keep in touch. Are you on LinkedIn?", es: "Tendríamos que seguir en contacto. ¿Tenés LinkedIn?", you: "Decí que sí y proponé conectar.", hint: ["Yes, let's connect.", "Sure, I'll send you a request."], model: ["Yes, of course. Let's connect.", "Sure. I'll send you a request tonight."], expect: [R("\\b(yes|sure|of course|linkedin|connect|send|request|email|card)\\b")], next: "end" },
        end: { say: "Lovely. It was really nice talking to you.", es: "Buenísimo. Fue un placer charlar con vos.", end: true }
      }
    },
    {
      id: "friend", title: "Alguien nuevo", sub: "Series, fútbol y la Argentina", level: "A2",
      who: { name: "Chris", role: "un chico que conocés en un bar", tone: "m", accent: "US" },
      intro: "Estás en un bar mirando un partido. Chris, que está al lado, te saca charla.",
      start: "start",
      turns: {
        start: { say: ["Hey, are you following the game?", "Hey! Who are you supporting tonight?"], es: "Che, ¿estás siguiendo el partido?", you: "Respondé y presentate.", hint: ["Yes! I'm Maxi, by the way.", "Not really. I'm …"], model: ["Yes, I love football. I'm Maxi, by the way.", "A little. I'm from Argentina, so I love football."], open: 1, next: "team" },
        team: { say: "Nice to meet you! I'm Chris. So, which team do you support?", es: "¡Un gusto! Soy Chris. ¿De qué equipo sos?", you: "Decí de qué equipo sos.", hint: ["I support …", "I'm a … fan."], model: ["I support River Plate.", "I'm a Boca Juniors fan."], open: 1, next: "messi" },
        messi: { say: "Cool! Everybody here loves Messi. Have you ever seen him play live?", es: "¡Qué bueno! Acá todos aman a Messi. ¿Alguna vez lo viste jugar en vivo?", you: "Respondé con «I have / I haven't».", hint: ["No, I haven't, but …", "Yes, I have! It was in …"], model: ["No, I haven't, but I'd love to.", "Yes, I have! I saw him in Buenos Aires in 2022."], expect: [R("\\b(yes|no|have|haven'?t|never|saw|seen|watched|live|once|would love)\\b")], next: "series" },
        series: { say: "Me neither. Hey, are you watching any good series right now?", es: "Yo tampoco. Che, ¿estás viendo alguna serie buena ahora?", you: "Contá qué serie ves y por qué te gusta.", hint: ["Yes, I'm watching …", "I just finished …"], model: ["Yes, I'm watching The Bear. It's really good.", "I just finished a great series about politics."], open: 1, next: "plans" },
        plans: { say: "I'll check it out. How long are you staying in town?", es: "La voy a ver. ¿Cuánto tiempo te quedás en la ciudad?", you: "Respondé.", hint: ["Until Sunday.", "For one week."], model: ["Until Sunday. I go back on Monday.", "For one more week."], expect: [R("\\b(until|for|week|weeks|days|day|sunday|monday|tuesday|wednesday|thursday|friday|saturday|month|NUM)\\b")], next: "end" },
        end: { say: "Awesome. If you want, we can watch the next game together!", es: "¡Genial! Si querés, vemos el próximo partido juntos.", end: true }
      }
    },
    {
      id: "jobint", cat: "Trabajo", title: "Entrevista laboral", sub: "Una empresa internacional te entrevista", level: "B1",
      who: { name: "Ms. Lee", role: "gerente de recursos humanos", tone: "f", accent: "US" },
      intro: "Videollamada con una empresa internacional que busca un especialista en comunicación digital.",
      start: "start",
      turns: {
        start: { say: ["Thanks for joining us. Can you tell me a little about yourself?", "Hi, nice to meet you. So, tell me about yourself."], es: "Gracias por sumarte. ¿Me contás un poco sobre vos?", you: "Presentate: quién sos, qué hacés y hace cuánto.", hint: ["I'm a digital communications specialist…", "I've been working in … for … years."], model: ["I'm a digital communications specialist from Buenos Aires. I've been working in social media for ten years.", "I'm a lawyer, but I work in communications. I lead social media teams."], expect: [K("i'?m|i am|i work|i'?ve been|working|specialist|communications|lawyer|years|from")], next: "why" },
        why: { say: "That's great. Why are you interested in this position?", es: "Muy bien. ¿Por qué te interesa este puesto?", you: "Dá dos razones. Usá «because».", hint: ["Because I want to …", "I'm interested because …"], model: ["Because I want to work on international campaigns and learn from a global team.", "I'm interested because your company works with digital strategy, and that's my passion."], expect: [K("because|want|interested|love|like|learn|grow|opportunity|experience|international|passion")], next: "strength" },
        strength: { say: "What would you say is your biggest strength?", es: "¿Cuál dirías que es tu mayor fortaleza?", you: "Nombrá una fortaleza y dá un ejemplo.", hint: ["I'm good at …", "My biggest strength is …"], model: ["My biggest strength is strategy. For example, I plan campaigns from start to finish.", "I'm very good at leading teams under pressure."], expect: [K("good at|strength|i'?m|i am|i can|able|example|lead|leading|strategy|creative|organized|team")], next: "weak" },
        weak: { say: "And what's something you're still working on?", es: "¿Y algo que todavía estés mejorando?", you: "Contá una debilidad y qué hacés para mejorarla.", hint: ["My English, but I practice every day.", "Sometimes I … , so now I …"], model: ["My English. That's why I practice every day with an app.", "Sometimes I take on too much work, so now I delegate more."], open: 3, next: "past" },
        past: { say: "Tell me about a difficult situation at work and how you solved it.", es: "Contame una situación difícil en el trabajo y cómo la resolviste.", you: "Contala en pasado: qué pasó, qué hiciste, cómo terminó.", hint: ["Once, we had a problem with …", "I talked to … and we decided …"], model: ["Once, a post went viral for the wrong reasons. We answered quickly and explained the facts.", "Last year we had a very short deadline, so I organized the team in two shifts."], expect: [K("once|last|we had|there was|happened|i decided|we decided|solved|talked|organized|answered|was|were|did")], next: "q" },
        q: { say: "Great answers. Do you have any questions for us?", es: "Muy buenas respuestas. ¿Tenés alguna pregunta para nosotros?", you: "Hacé una pregunta sobre el puesto o el equipo.", hint: ["What does a typical day look like?", "How big is the team?"], model: ["What does a typical day look like in this role?", "How big is the team, and who would I work with?"], expect: [K("what|how|who|when|where|is there|are there|can i|do you|could you")], next: "end" },
        end: { say: "Good question. We'll be in touch next week. Thanks again for your time!", es: "Buena pregunta. Te contactamos la semana que viene. ¡Gracias por tu tiempo!", end: true }
      }
    },
    {
      id: "firstday", cat: "Trabajo", title: "Primer día", sub: "Conocé a tu nuevo equipo", level: "A2",
      who: { name: "Ben", role: "líder de equipo en Londres", tone: "m", accent: "UK" },
      intro: "Primer día en una oficina de Londres. Ben te da la bienvenida.",
      start: "start",
      turns: {
        start: { say: ["Welcome to the team! How was your trip to the office?", "Hi, welcome! Did you find the office okay?"], es: "¡Bienvenido al equipo! ¿Cómo llegaste a la oficina?", you: "Contá cómo llegaste.", hint: ["It was easy, I took the tube.", "I got a bit lost, but …"], model: ["It was easy. I took the tube.", "I got a bit lost, but a nice woman helped me."], open: 2, next: "before" },
        before: { say: "Good to hear. So, what were you doing before you joined us?", es: "Qué bueno. ¿Y qué hacías antes de sumarte?", you: "Contá tu trabajo anterior en pasado.", hint: ["I worked as …", "I was a … at …"], model: ["I worked as a social media manager in Buenos Aires.", "I was a communications advisor for the government."], expect: [K("worked|was|i used to|i managed|i led|before|job|company|government|agency")], next: "coffee" },
        coffee: { say: "Interesting! Let me show you around. Do you drink coffee or tea?", es: "¡Interesante! Te muestro la oficina. ¿Tomás café o té?", you: "Respondé y decí cómo lo tomás.", hint: ["Coffee, black please.", "Tea with milk, thanks."], model: ["Coffee, please. Black, no sugar.", "I usually drink mate, but tea is fine."], expect: [K("coffee|tea|mate|water|black|milk|sugar|both|neither|nothing")], next: "team" },
        team: { say: "This is where the team sits. Is there anything you'd like to know about how we work?", es: "Acá se sienta el equipo. ¿Querés saber algo de cómo trabajamos?", you: "Preguntá algo (horarios, reuniones, herramientas).", hint: ["What time do you usually start?", "Do you work from home on Fridays?"], model: ["What time do you usually start in the morning?", "Do people work from home some days?"], expect: [K("what|how|when|do you|do people|is there|are there|can i|which")], next: "lunch" },
        lunch: { say: "Good question: we start at nine, and Fridays are from home. Would you like to join us for lunch today?", es: "Buena pregunta: empezamos a las nueve y los viernes son desde casa. ¿Querés almorzar con nosotros hoy?", you: "Aceptá con ganas.", hint: ["I'd love to!", "Sure, thanks for inviting me."], model: ["I'd love to. Thanks for inviting me!", "Sure! Where do you usually go?"], open: 1, next: "end" },
        end: { say: "Brilliant. We usually go at one. See you then!", es: "Genial. Solemos ir a la una. ¡Nos vemos!", end: true }
      }
    },
    {
      id: "brainstorm", cat: "Trabajo", title: "Lluvia de ideas", sub: "Pensá una campaña con el equipo", level: "B1",
      who: { name: "Priya", role: "gerente de redes sociales", tone: "f", accent: "UK" },
      intro: "Reunión creativa: hay que pensar una campaña para que más jóvenes usen el transporte público.",
      start: "start",
      turns: {
        start: { say: "Okay, we need ideas to get young people to use public transport. Any thoughts?", es: "Bueno, necesitamos ideas para que los jóvenes usen el transporte público. ¿Alguna idea?", you: "Proponé una idea con «What if we…?» o «We could…».", hint: ["What if we …?", "We could make …"], model: ["What if we make short videos with real students on the bus?", "We could create a challenge on TikTok."], expect: [K("what if|we could|maybe|how about|let'?s|i think|idea|video|videos|challenge|influencer|influencers|app|game|discount")], next: "why" },
        why: { say: ["I like that. Why do you think it would work?", "Interesting. What makes you think it would work?"], es: "Me gusta. ¿Por qué creés que funcionaría?", you: "Justificá con «because».", hint: ["Because young people …", "It would work because …"], model: ["Because young people trust people like them more than ads.", "It would work because it's fun and easy to share."], expect: [K("because|since|so|young|people|they|share|trust|fun|easy|real")], next: "platform" },
        platform: { say: "Which platform should we use first?", es: "¿Qué plataforma usamos primero?", you: "Elegí una plataforma y explicá.", hint: ["TikTok, because …", "I'd start with Instagram."], model: ["I'd start with TikTok, because that's where students are.", "Instagram Reels, and then YouTube Shorts."], expect: [K("tiktok|instagram|youtube|x|twitter|facebook|whatsapp|twitch|reels|shorts|first|start")], next: "measure" },
        measure: { say: "And how would we measure if it's working?", es: "¿Y cómo mediríamos si funciona?", you: "Proponé una métrica.", hint: ["We could track …", "By measuring …"], model: ["We could track views, shares and how many people use the student card.", "By measuring engagement and new users of the app."], expect: [K("track|measure|measuring|views|shares|engagement|users|numbers|data|survey|clicks|downloads|reach")], next: "next" },
        next: { say: "Perfect. Can you put this in a short proposal for Thursday?", es: "Perfecto. ¿Lo podés armar en una propuesta corta para el jueves?", you: "Confirmá.", hint: ["Sure, I'll have it ready.", "No problem."], model: ["Sure. I'll send it on Wednesday night.", "No problem, I'll have it ready by Thursday."], open: 1, next: "end" },
        end: { say: "Great teamwork, everyone. Thanks!", es: "Gran trabajo en equipo. ¡Gracias!", end: true }
      }
    },
    {
      id: "extension", cat: "Trabajo", title: "Pedir más tiempo", sub: "Tu jefe pregunta por un informe atrasado", level: "B1",
      who: { name: "David", role: "tu jefe", tone: "m", accent: "US" },
      intro: "Tu jefe te frena en el pasillo para preguntarte por un informe que tenía que estar hoy.",
      start: "start",
      turns: {
        start: { say: "Hey, how's the report going? I was expecting it today.", es: "Che, ¿cómo va el informe? Lo esperaba para hoy.", you: "Explicá que todavía no está.", hint: ["I'm sorry, it's not ready yet.", "I'm almost done, but …"], model: ["I'm sorry, it's not ready yet. I'm almost done.", "I'm working on it, but I need a little more time."], expect: [K("sorry|not ready|not finished|almost|working on|need|more time|yet|still")], next: "why" },
        why: { say: "What happened?", es: "¿Qué pasó?", you: "Dá el motivo en pasado.", hint: ["The data arrived late.", "I had to …"], model: ["The data from the other team arrived late.", "I had to finish an urgent campaign first."], expect: [K("arrived|late|had to|was|were|didn'?t|couldn'?t|because|urgent|problem|sick|waiting")], next: "when" },
        when: { say: "Okay. When can you have it ready?", es: "Bien. ¿Para cuándo lo podés tener?", you: "Proponé un plazo concreto.", hint: ["By tomorrow at noon.", "On Friday morning."], model: ["I can have it ready by tomorrow at noon.", "By Friday morning at the latest."], expect: [K("tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|morning|afternoon|noon|by|end of|hours|NUM")], next: "help" },
        help: { say: "Fine. Is there anything you need from me to finish it?", es: "Bien. ¿Necesitás algo de mi parte para terminarlo?", you: "Pedí algo concreto o decí que no.", hint: ["Could you send me …?", "No, I have everything, thanks."], model: ["Could you ask the data team to send me the last numbers?", "No, I have everything. Thanks for understanding."], open: 2, next: "end" },
        end: { say: "Sounds good. Just keep me posted, okay?", es: "Bárbaro. Mantenéme al tanto, ¿sí?", end: true }
      }
    },
    {
      id: "feedback", cat: "Trabajo", title: "Dar feedback", sub: "Comentale un diseño a una diseñadora", level: "B1",
      who: { name: "Zoe", role: "diseñadora gráfica", tone: "f", accent: "UK" },
      intro: "Zoe te muestra la pieza para una campaña. Tenés que darle tu opinión sin desanimarla.",
      start: "start",
      turns: {
        start: { say: "So, what do you think of the new design?", es: "¿Y? ¿Qué te parece el diseño nuevo?", you: "Empezá por algo positivo.", hint: ["I really like the …", "It looks great, especially …"], model: ["I really like it. The colors are very strong.", "It looks great, especially the photo."], expect: [K("like|love|great|good|nice|beautiful|strong|clean|works|especially|colors|photo")], next: "change" },
        change: { say: "Thanks! Is there anything you'd change?", es: "¡Gracias! ¿Cambiarías algo?", you: "Pedí un cambio con suavidad: «Maybe we could…».", hint: ["Maybe we could make the text bigger.", "I'd change …"], model: ["Maybe we could make the text a bit bigger. It's hard to read on a phone.", "I'd change the logo position. It's too small."], expect: [K("maybe|could|would|change|bigger|smaller|text|logo|color|colors|font|move|instead|less|more")], next: "why" },
        why: { say: "Hmm, okay. Why do you think that's important?", es: "Mmm, bueno. ¿Por qué te parece importante?", you: "Explicá pensando en el público.", hint: ["Because most people see it on their phones.", "Because the message must be clear."], model: ["Because most people will see it on their phones.", "Because the main message has to be clear in two seconds."], expect: [K("because|people|phone|phones|mobile|clear|read|message|audience|seconds|quick")], next: "when" },
        when: { say: "That makes sense. When do you need the new version?", es: "Tiene sentido. ¿Para cuándo necesitás la versión nueva?", you: "Decí el plazo.", hint: ["By Wednesday, if possible.", "Tomorrow afternoon would be great."], model: ["By Wednesday, if possible.", "Tomorrow afternoon would be perfect."], expect: [K("tomorrow|today|monday|tuesday|wednesday|thursday|friday|morning|afternoon|by|possible|end of")], next: "end" },
        end: { say: "Perfect, I'll send it then. Thanks for the feedback!", es: "Perfecto, te lo mando para entonces. ¡Gracias por el feedback!", end: true }
      }
    },
    {
      id: "crisis", cat: "Trabajo", title: "Crisis en redes", sub: "Un posteo se volvió viral por mal", level: "B1",
      who: { name: "Nina", role: "directora de prensa", tone: "f", accent: "US" },
      intro: "Un posteo de la cuenta oficial se está viralizando con críticas. Nina te llama de urgencia.",
      start: "start",
      turns: {
        start: { say: "Have you seen the comments on this morning's post? What happened?", es: "¿Viste los comentarios del posteo de esta mañana? ¿Qué pasó?", you: "Explicá qué pasó en pasado.", hint: ["Yes, we published a wrong number.", "People misunderstood the message."], model: ["Yes. We published a wrong number in the graphic.", "People misunderstood the message and it went viral."], expect: [K("yes|we|published|posted|wrong|mistake|error|misunderstood|went viral|people|comments")], next: "first" },
        first: { say: "Okay. What should we do first?", es: "Bien. ¿Qué hacemos primero?", you: "Proponé el primer paso con «I think we should…».", hint: ["I think we should delete it and …", "We should post a correction."], model: ["I think we should post a correction right now and explain the mistake.", "We should fix the graphic and answer the main comments."], expect: [K("should|need to|have to|let'?s|first|correction|delete|fix|explain|answer|apologize|statement")], next: "message" },
        message: { say: "Good. What would the message say, more or less?", es: "Bien. ¿Qué diría el mensaje, más o menos?", you: "Dictá el mensaje corto.", hint: ["We made a mistake in the …", "The correct number is …"], model: ["We made a mistake in this morning's graphic. The correct number is five thousand.", "Thanks for pointing it out. Here is the correct information."], open: 4, next: "approve" },
        approve: { say: "Clear and short, I like it. Who needs to approve it before we post?", es: "Claro y corto, me gusta. ¿Quién lo tiene que aprobar antes de publicar?", you: "Decí quién aprueba y en cuánto tiempo.", hint: ["The minister's office, in ten minutes.", "Our director has to approve it."], model: ["The director has to approve it. I'll send it to her now.", "The minister's office. I'll call them right away."], open: 3, next: "after" },
        after: { say: "Great. And what do we learn from this for next time?", es: "Genial. ¿Y qué aprendemos para la próxima?", you: "Proponé un cambio en el proceso.", hint: ["We need a second check before posting.", "Next time, two people should review the numbers."], model: ["Next time, two people should check the numbers before we post.", "We need a checklist for every graphic."], expect: [K("next time|should|need|check|review|two people|double|before|checklist|process")], next: "end" },
        end: { say: "Agreed. Let's get it done. Good job keeping calm.", es: "De acuerdo. Manos a la obra. Bien por mantener la calma.", end: true }
      }
    },
    {
      id: "networking", cat: "Trabajo", title: "Networking", sub: "Presentá lo que hacés en un minuto", level: "B1",
      who: { name: "Paul", role: "consultor en un congreso", tone: "m", accent: "UK" },
      intro: "En el café de un congreso, Paul se acerca a charlar.",
      start: "start",
      turns: {
        start: { say: ["Hi there, I'm Paul. What brings you to the conference?", "Hello! First time at this conference?"], es: "Hola, soy Paul. ¿Qué te trae al congreso?", you: "Presentate y decí por qué viniste.", hint: ["I'm Maxi. I came to learn about …", "I work in …, so …"], model: ["I'm Maxi. I came to learn about new trends in digital communication.", "I work in government communications, so this is very useful for me."], expect: [K("i'?m|i am|my name|came|here to|learn|work|interested|first time")], next: "pitch" },
        pitch: { say: "Nice. And what exactly do you do?", es: "Bien. ¿Y qué hacés exactamente?", you: "Explicá tu trabajo en dos frases.", hint: ["I lead a team that …", "I help … to …"], model: ["I lead a team that plans and creates content for social media.", "I help public institutions explain their work in a simple way."], expect: [K("i lead|i help|i manage|i work|i create|i plan|we|team|content|campaigns|social|strategy")], next: "project" },
        project: { say: "That sounds interesting. What's a project you're proud of?", es: "Suena interesante. ¿De qué proyecto estás orgulloso?", you: "Contá un proyecto con un resultado.", hint: ["Last year we …", "A campaign about … that reached …"], model: ["Last year we launched a campaign that reached ten million people.", "A video series that explained new rules in one minute."], open: 4, next: "contact" },
        contact: { say: "Impressive. We should stay in touch. Do you have a card, or are you on LinkedIn?", es: "Impresionante. Sigamos en contacto. ¿Tenés tarjeta o estás en LinkedIn?", you: "Ofrecé tu contacto.", hint: ["Sure, here's my card.", "Yes, let me find you on LinkedIn."], model: ["Sure, here's my card. You can also find me on LinkedIn.", "Yes, let me scan your QR code."], expect: [K("sure|yes|card|linkedin|email|phone|number|scan|connect|find you")], next: "end" },
        end: { say: "Great. Enjoy the rest of the conference!", es: "Genial. ¡Que disfrutes el resto del congreso!", end: true }
      }
    },
    {
      id: "qna", cat: "Trabajo", title: "Preguntar en una charla", sub: "Levantá la mano al final de una conferencia", level: "B1",
      who: { name: "Dr. Kim", role: "oradora de un congreso", tone: "f", accent: "US" },
      intro: "Terminó una charla sobre inteligencia artificial en comunicación. Te dan el micrófono.",
      start: "start",
      turns: {
        start: { say: "Thank you all. We have time for one more question. Yes, you in the middle.", es: "Gracias a todos. Hay tiempo para una pregunta más. Sí, vos, en el medio.", you: "Agradecé la charla y hacé tu pregunta.", hint: ["Thank you for the talk. My question is …", "How do you …?"], model: ["Thank you for the great talk. My question is: how can small teams start using AI?", "Thanks. Do you think AI will replace community managers?"], expect: [K("thank|thanks|question|how|what|do you|can|why|which|would")], next: "follow" },
        follow: { say: "Great question. I'd say start small, with one simple task. Does that answer your question?", es: "Buena pregunta. Yo diría: empezá de a poco, con una tarea simple. ¿Responde tu pregunta?", you: "Pedí un ejemplo concreto.", hint: ["Yes, could you give an example?", "Kind of. What task would you start with?"], model: ["Yes, thanks. Could you give us an example of a simple task?", "Kind of. Which task would you start with?"], expect: [K("example|which|what|could you|can you|yes|kind of|for instance|task")], next: "clarify" },
        clarify: { say: "Sure. For example, writing the first draft of your weekly report. Does that help?", es: "Claro. Por ejemplo, escribir el primer borrador del informe semanal. ¿Te sirve?", you: "Agradecé y cerrá.", hint: ["Yes, that's very helpful. Thank you.", "Perfect, thanks a lot."], model: ["Yes, that's very helpful. Thank you so much.", "Perfect. Thanks a lot."], open: 1, next: "end" },
        end: { say: "My pleasure. Thanks, everyone!", es: "Un placer. ¡Gracias a todos!", end: true }
      }
    },
    {
      id: "client", cat: "Trabajo", title: "Cliente enojado", sub: "Los números bajaron y quiere explicaciones", level: "B1",
      who: { name: "Mr. Grant", role: "cliente de tu agencia", tone: "m", accent: "US" },
      intro: "Un cliente llama molesto: los resultados del mes bajaron.",
      start: "start",
      turns: {
        start: { say: "I just saw the monthly report. Our engagement went down twenty percent. What's going on?", es: "Acabo de ver el informe mensual. La interacción bajó un veinte por ciento. ¿Qué está pasando?", you: "Mostrá que entendés su preocupación.", hint: ["I understand your concern.", "You're right, the numbers went down."], model: ["I understand your concern, and you're right, the numbers went down.", "Thanks for calling. Let me explain what happened."], expect: [K("understand|right|sorry|concern|let me|explain|thanks|numbers|went down|i know")], next: "why" },
        why: { say: "So, why did it happen?", es: "¿Y por qué pasó?", you: "Explicá la causa.", hint: ["The platform changed its algorithm.", "We posted less because …"], model: ["The platform changed its algorithm, and that affected everyone.", "We posted less video this month, and video gets more engagement."], expect: [K("because|algorithm|changed|posted|less|fewer|platform|video|budget|holiday|season")], next: "plan" },
        plan: { say: "Okay. What's your plan to fix it?", es: "Bien. ¿Cuál es el plan para arreglarlo?", you: "Contá el plan con «We're going to…».", hint: ["We're going to post more videos.", "We will test new formats."], model: ["We're going to post three videos a week and test new formats.", "We will increase the budget for the best posts."], expect: [K("going to|will|'ll|plan|more|test|increase|post|videos|formats|budget|change")], next: "when" },
        when: { say: "And when will I see results?", es: "¿Y cuándo voy a ver resultados?", you: "Dá un plazo realista.", hint: ["In about two weeks.", "By the end of the month."], model: ["You should see results in about two weeks.", "By the end of the month. I'll send you a weekly update."], expect: [K("week|weeks|month|days|end of|soon|update|by|NUM")], next: "end" },
        end: { say: "Alright. I appreciate the honesty. Keep me updated.", es: "Bueno. Valoro la sinceridad. Mantenéme al tanto.", end: true }
      }
    },
    {
      id: "late", cat: "Trabajo", title: "Llegar tarde", sub: "Disculpate y ponete al día en una reunión", level: "A2+",
      who: { name: "Anna", role: "gerente de proyecto", tone: "f", accent: "UK" },
      intro: "Entrás quince minutos tarde a una reunión que ya empezó.",
      start: "start",
      turns: {
        start: { say: "Oh, there you are! We started a few minutes ago.", es: "¡Ah, ahí estás! Empezamos hace unos minutos.", you: "Disculpate y explicá por qué.", hint: ["Sorry I'm late. The traffic was terrible.", "I'm so sorry, my train was delayed."], model: ["Sorry I'm late. The traffic was terrible.", "I'm so sorry. My previous meeting ran late."], expect: [K("sorry|apologize|late|traffic|train|bus|meeting|delayed|ran late")], next: "missed" },
        missed: { say: "No worries. Do you want me to tell you what you missed?", es: "No pasa nada. ¿Querés que te cuente lo que te perdiste?", you: "Pedí un resumen corto.", hint: ["Yes, please, just the main points.", "Could you give me a quick summary?"], model: ["Yes, please. Just the main points.", "Could you give me a quick summary?"], expect: [K("yes|please|summary|main points|quick|could you|what did i miss|sure")], next: "opinion" },
        opinion: { say: "We decided to launch the campaign in March, not February. What do you think?", es: "Decidimos lanzar la campaña en marzo, no en febrero. ¿Qué pensás?", you: "Dá tu opinión.", hint: ["I agree, because …", "I'm not sure. February is …"], model: ["I agree. March gives us more time to prepare.", "I'm not sure. In February many people are on holiday, so March is better."], open: 3, next: "task" },
        task: { say: "Good point. Can you take care of the social media calendar?", es: "Buen punto. ¿Te podés encargar del calendario de redes?", you: "Aceptá y decí cuándo lo tenés.", hint: ["Sure, I'll have it by Monday.", "Of course."], model: ["Sure. I'll have the first version by Monday.", "Of course. I'll share it with everyone."], open: 1, next: "end" },
        end: { say: "Perfect. Let's move on to the next point.", es: "Perfecto. Pasemos al siguiente tema.", end: true }
      }
    },
    {
      id: "carrental", cat: "Viajes", title: "Alquilar un auto", sub: "Seguro, combustible y devolución", level: "A2+",
      who: { name: "Steve", role: "empleado de una rentadora en Miami", tone: "m", accent: "US" },
      intro: "Llegás al mostrador de la rentadora de autos en el aeropuerto de Miami.",
      start: "start",
      turns: {
        start: { say: ["Hi, welcome. Do you have a reservation?", "Good morning! Picking up a car today?"], es: "Hola, bienvenido. ¿Tenés reserva?", you: "Decí que sí y a nombre de quién.", hint: ["Yes, under the name Defranchi.", "Yes, I booked online."], model: ["Yes, I have a reservation under Defranchi.", "Yes, I booked a small car online."], expect: [K("yes|reservation|booked|under|name|online|no")], next: "license" },
        license: { say: "Great. Can I see your driver's license and a credit card?", es: "Bien. ¿Me mostrás tu licencia de conducir y una tarjeta de crédito?", you: "Entregalos y preguntá si sirve la licencia argentina.", hint: ["Here you are. Is my Argentine license okay?", "Sure, here they are."], model: ["Here you are. Is an Argentine license okay?", "Sure. I also have an international license."], open: 2, next: "insurance" },
        insurance: { say: "That's fine. Would you like full insurance? It's twenty dollars a day.", es: "Está bien. ¿Querés el seguro completo? Son veinte dólares por día.", you: "Decidí y preguntá qué cubre.", hint: ["What does it cover?", "Yes, please. Full insurance."], model: ["What does it cover exactly?", "Yes, please. I'd like full insurance."], expect: [K("yes|no|what does|cover|covers|full|basic|insurance|please|thanks")], next: "fuel" },
        fuel: { say: "It covers everything. The car comes with a full tank, and you return it full. Okay?", es: "Cubre todo. El auto sale con el tanque lleno y lo devolvés lleno. ¿De acuerdo?", you: "Confirmá y preguntá a qué hora lo devolvés.", hint: ["Okay. What time do I have to return it?", "Got it."], model: ["Okay. What time do I have to bring it back?", "Got it. Where is the nearest gas station?"], open: 1, next: "return" },
        return: { say: "Any time before noon on Sunday. Will anyone else be driving?", es: "Cuando quieras antes del mediodía del domingo. ¿Va a manejar alguien más?", you: "Respondé.", hint: ["No, just me.", "Yes, my friend too."], model: ["No, just me.", "Yes, my friend will drive too. Is that extra?"], expect: [K("no|yes|just me|only me|friend|wife|husband|partner|brother|extra")], next: "end" },
        end: { say: "All set. Your car is in spot twelve. Drive safe!", es: "Listo. Tu auto está en el lugar doce. ¡Manejá con cuidado!", end: true }
      }
    },
    {
      id: "lostbag", cat: "Viajes", title: "Valija perdida", sub: "Tu equipaje no llegó", level: "B1",
      who: { name: "Joan", role: "empleada de equipajes en Londres", tone: "f", accent: "UK" },
      intro: "Esperaste en la cinta y tu valija nunca salió. Vas a la oficina de equipajes.",
      start: "start",
      turns: {
        start: { say: "Hello, how can I help?", es: "Hola, ¿en qué te ayudo?", you: "Explicá que tu valija no llegó.", hint: ["My suitcase didn't arrive.", "I can't find my luggage."], model: ["Hi. My suitcase didn't arrive on the flight from Madrid.", "I waited, but my luggage never came out."], expect: [K("suitcase|luggage|bag|didn'?t arrive|never came|lost|can'?t find|missing")], next: "flight" },
        flight: { say: "I'm sorry. What was your flight number?", es: "Lo siento. ¿Cuál era tu número de vuelo?", you: "Decí el número de vuelo.", hint: ["IB six one six.", "It's BA two four seven."], model: ["It was IB six one six, from Madrid.", "BA two four seven."], open: 1, next: "describe" },
        describe: { say: "Thank you. Can you describe the suitcase?", es: "Gracias. ¿Me describís la valija?", you: "Describila: tamaño, color, detalles.", hint: ["It's a big black suitcase with …", "It's medium, blue, with a red ribbon."], model: ["It's a big black suitcase with four wheels and a red ribbon.", "It's a medium blue bag with my name on a tag."], expect: [K("big|small|medium|large|black|blue|red|grey|gray|green|white|brown|wheels|ribbon|tag|hard|soft")], next: "inside" },
        inside: { say: "And is there anything valuable or urgent inside?", es: "¿Y hay algo de valor o urgente adentro?", you: "Decí qué necesitás con urgencia.", hint: ["My medicine and a suit for a meeting.", "Just clothes."], model: ["Yes, my medicine and a suit for a meeting tomorrow.", "No, just clothes and shoes."], open: 2, next: "address" },
        address: { say: "Okay. Where should we deliver it when we find it?", es: "Bien. ¿A dónde te la enviamos cuando aparezca?", you: "Dá la dirección del hotel.", hint: ["To the Hilton hotel in Kensington.", "To this address: …"], model: ["To the Hilton hotel in Kensington, please.", "To my hotel. Here's the address."], expect: [K("hotel|address|street|road|to the|here'?s|deliver|room")], next: "end" },
        end: { say: "Done. Here's your reference number. We'll text you with any news.", es: "Listo. Este es tu número de reclamo. Te avisamos por mensaje.", end: true }
      }
    },
    {
      id: "train", cat: "Viajes", title: "Pasaje de tren", sub: "Ida y vuelta, horario y andén", level: "A2",
      who: { name: "Oliver", role: "boletero en una estación de Londres", tone: "m", accent: "UK" },
      intro: "Querés ir de Londres a Oxford en tren. Hacés la fila en la ventanilla.",
      start: "start",
      turns: {
        start: { say: ["Hello, where would you like to go?", "Morning. Where are you travelling to?"], es: "Hola, ¿a dónde querés ir?", you: "Decí a dónde vas.", hint: ["To Oxford, please.", "A ticket to Oxford."], model: ["One ticket to Oxford, please.", "To Oxford, please."], expect: [K("oxford|to|ticket|cambridge|bath|brighton|please")], next: "type" },
        type: { say: "Single or return?", es: "¿Solo ida o ida y vuelta?", you: "Elegí.", hint: ["Return, please.", "Just single."], model: ["Return, please. I'm coming back tonight.", "Single, please."], expect: [K("single|return|one way|round trip|back|both")], next: "time" },
        time: { say: "There's a train at ten fifteen and another at ten forty-five. Which one?", es: "Hay un tren a las 10:15 y otro a las 10:45. ¿Cuál?", you: "Elegí el horario.", hint: ["The ten fifteen, please.", "The later one."], model: ["The ten fifteen, please.", "The later one, at ten forty-five."], expect: [K("ten|fifteen|forty|later|earlier|first|second|one|10")], next: "card" },
        card: { say: "That's thirty-two pounds. Do you have a railcard?", es: "Son 32 libras. ¿Tenés tarjeta de descuento?", you: "Respondé y pagá.", hint: ["No, I don't. Can I pay by card?", "No. Here you are."], model: ["No, I don't. Can I pay by card?", "No, I'm a tourist. Here you are."], expect: [K("no|yes|don'?t|card|cash|pay|here|tourist")], next: "platform" },
        platform: { say: "Here's your ticket. It leaves from platform nine.", es: "Acá está tu pasaje. Sale del andén nueve.", you: "Confirmá el andén para estar seguro.", hint: ["Platform nine?", "Sorry, which platform?"], model: ["Platform nine? Thank you.", "Sorry, did you say platform five or nine?"], open: 1, next: "end" },
        end: { say: "Nine, that's right. Have a good trip!", es: "Nueve, así es. ¡Buen viaje!", end: true }
      }
    },
    {
      id: "tour", cat: "Viajes", title: "Visita guiada", sub: "Charlá con el guía de un tour", level: "A2",
      who: { name: "Sam", role: "guía turístico en Nueva York", tone: "m", accent: "US" },
      intro: "Estás en un tour a pie por Nueva York. Sam, el guía, charla con el grupo.",
      start: "start",
      turns: {
        start: { say: "Welcome, everybody! Where are you all from? What about you?", es: "¡Bienvenidos! ¿De dónde son? ¿Y vos?", you: "Decí de dónde sos.", hint: ["I'm from Argentina.", "From Buenos Aires."], model: ["I'm from Buenos Aires, Argentina.", "From Argentina. It's my first time here."], expect: [K("from|argentina|buenos aires|i'?m|south america")], next: "before" },
        before: { say: ["Argentina, awesome! Have you been to New York before?", "Cool! Is this your first time in the city?"], es: "¡Argentina, genial! ¿Ya habías estado en Nueva York?", you: "Respondé con «I have / I haven't».", hint: ["No, I haven't. It's my first time.", "Yes, I came in 2019."], model: ["No, I haven't. It's my first time.", "Yes, I came here in 2019 for work."], expect: [K("yes|no|haven'?t|have|first time|came|was here|before")], next: "question" },
        question: { say: "This is Grand Central. Any questions so far?", es: "Esto es Grand Central. ¿Alguna pregunta hasta ahora?", you: "Hacé una pregunta sobre el lugar.", hint: ["How old is this building?", "Can we go inside?"], model: ["How old is this building?", "Can we go inside and take pictures?"], expect: [K("how|what|when|who|why|can we|can i|is it|is there|old|inside")], next: "photo" },
        photo: { say: "It opened in 1913, and yes, you can go in! Do you want me to take a photo of you?", es: "Se inauguró en 1913 y sí, se puede entrar. ¿Querés que te saque una foto?", you: "Aceptá y pedí algo concreto.", hint: ["Yes, please! With the clock behind me.", "Sure, thank you."], model: ["Yes, please! Can you get the clock behind me?", "Sure, thanks a lot."], open: 1, next: "rec" },
        rec: { say: "Great shot! Any plans for tonight?", es: "¡Linda foto! ¿Tenés planes para esta noche?", you: "Contá tu plan con «I'm going to…».", hint: ["I'm going to see a show on Broadway.", "Not yet. Any recommendations?"], model: ["I'm going to see a musical on Broadway.", "Not yet. Do you have any recommendations?"], open: 2, next: "end" },
        end: { say: "Nice! Okay, everybody, let's keep walking.", es: "¡Bien! Bueno, sigamos caminando.", end: true }
      }
    },
    {
      id: "customs", cat: "Viajes", title: "Aduana", sub: "¿Algo para declarar?", level: "A2",
      who: { name: "Officer Brown", role: "agente de aduana en Estados Unidos", tone: "m", accent: "US" },
      intro: "Pasaste migraciones. Ahora te para un agente de aduana.",
      start: "start",
      turns: {
        start: { say: "Good afternoon. Do you have anything to declare?", es: "Buenas tardes. ¿Tenés algo para declarar?", you: "Respondé.", hint: ["No, nothing to declare.", "I'm not sure. I have some food."], model: ["No, I have nothing to declare.", "I'm not sure. I have some alfajores."], expect: [K("no|nothing|yes|not sure|food|declare|alfajores|gifts")], next: "food" },
        food: { say: "Are you bringing any food, plants or meat?", es: "¿Traés comida, plantas o carne?", you: "Respondé con detalle.", hint: ["Only some chocolates.", "No, nothing like that."], model: ["Only some chocolates and alfajores, in their packages.", "No, nothing like that."], expect: [K("no|yes|only|chocolate|chocolates|alfajores|candy|cookies|nothing|meat|cheese|mate")], next: "cash" },
        cash: { say: "Are you carrying more than ten thousand dollars in cash?", es: "¿Llevás más de diez mil dólares en efectivo?", you: "Respondé.", hint: ["No, much less.", "No, about five hundred."], model: ["No, I only have about five hundred dollars.", "No, much less than that."], expect: [K("no|yes|less|only|about|hundred|thousand|NUM")], next: "bag" },
        bag: { say: "Okay. Can you open this bag for me, please?", es: "Bien. ¿Podés abrir este bolso, por favor?", you: "Aceptá.", hint: ["Sure, no problem.", "Of course."], model: ["Sure, no problem.", "Of course. Here you go."], open: 1, next: "what" },
        what: { say: "What's this yellow package?", es: "¿Qué es este paquete amarillo?", you: "Explicá qué es.", hint: ["It's yerba mate, a kind of tea.", "It's a gift for a friend."], model: ["It's yerba mate. It's a kind of tea from Argentina.", "It's a gift for a friend. It's just coffee."], expect: [K("it'?s|it is|mate|tea|gift|coffee|present|herb|herbs|drink")], next: "end" },
        end: { say: "Alright, that's fine. Welcome to the United States.", es: "Bien, está todo en orden. Bienvenido a Estados Unidos.", end: true }
      }
    },
    {
      id: "airbnb", cat: "Viajes", title: "Llegada al alojamiento", sub: "La anfitriona te explica todo", level: "A2+",
      who: { name: "Kate", role: "anfitriona de tu alojamiento en Edimburgo", tone: "f", accent: "UK" },
      intro: "Llegás al departamento que alquilaste. Kate te recibe en la puerta.",
      start: "start",
      turns: {
        start: { say: "Hi! You made it. How was your journey?", es: "¡Hola! Llegaste. ¿Qué tal el viaje?", you: "Contá cómo fue.", hint: ["Long, but okay.", "Great, thanks. A bit tiring."], model: ["Long, but okay. The flight was on time.", "Great, thanks. Just a bit tired."], open: 2, next: "rules" },
        rules: { say: "Here are your keys. Just one rule: no loud music after ten. Is that okay?", es: "Acá tenés las llaves. Una sola regla: nada de música fuerte después de las diez. ¿Está bien?", you: "Confirmá.", hint: ["Of course, no problem.", "Sure."], model: ["Of course, no problem.", "Sure, I'm very quiet."], open: 1, next: "wifi" },
        wifi: { say: "Brilliant. Is there anything you need to know?", es: "Genial. ¿Necesitás saber algo?", you: "Preguntá por el wifi, la calefacción o el checkout.", hint: ["What's the wifi password?", "How does the heating work?"], model: ["What's the wifi password?", "How does the heating work?"], expect: [K("wifi|password|heating|heat|checkout|check out|towels|keys|how|what|where|when")], next: "eat" },
        eat: { say: "It's all written on the fridge. Do you want any tips for food nearby?", es: "Está todo anotado en la heladera. ¿Querés recomendaciones para comer cerca?", you: "Pedí una recomendación concreta.", hint: ["Yes! Where can I eat something typical?", "Is there a good pub near here?"], model: ["Yes! Where can I try something typical?", "Is there a good pub near here?"], expect: [K("yes|where|pub|restaurant|typical|food|eat|cafe|near|recommend|try")], next: "out" },
        out: { say: "Try the pub on the corner, it's lovely. Checkout is at eleven on Sunday. Any questions?", es: "Probá el pub de la esquina, es hermoso. El checkout es a las once del domingo. ¿Alguna pregunta?", you: "Pedí algo (dejar la valija, salir más tarde) o agradecé.", hint: ["Can I leave my bag after checkout?", "No, thanks for everything."], model: ["Can I leave my bag here after checkout?", "No, thank you for everything."], open: 2, next: "end" },
        end: { say: "Of course. Enjoy Edinburgh!", es: "Por supuesto. ¡Disfrutá Edimburgo!", end: true }
      }
    },
    {
      id: "lostcity", cat: "Viajes", title: "Perdido y sin batería", sub: "Pedile ayuda a alguien en la calle", level: "A2",
      who: { name: "Jordan", role: "un vecino en Boston", tone: "m", accent: "US" },
      intro: "Se te apagó el celular y no sabés cómo volver al hotel. Le hablás a alguien en la calle.",
      start: "start",
      turns: {
        start: { say: ["Hey, are you okay? You look lost.", "Hi there, can I help you with something?"], es: "Che, ¿estás bien? Parecés perdido.", you: "Pedí ayuda y explicá el problema.", hint: ["Yes, my phone died and I'm lost.", "Excuse me, could you help me?"], model: ["Yes, actually. My phone died and I'm lost.", "Excuse me, could you help me? I need to get to my hotel."], expect: [K("yes|lost|phone|died|battery|help|could you|hotel|need")], next: "where" },
        where: { say: "Sure. Where are you trying to go?", es: "Claro. ¿A dónde querés ir?", you: "Decí a dónde.", hint: ["To the Marriott on Main Street.", "To my hotel near the park."], model: ["To the Marriott hotel, near the river.", "To my hotel. It's near Boston Common."], expect: [K("to|hotel|street|near|park|station|square|avenue|downtown")], next: "dir" },
        dir: { say: "Okay, go straight for two blocks, then turn left at the church. It's on your right.", es: "Bien, seguí derecho dos cuadras, doblá a la izquierda en la iglesia. Está a tu derecha.", you: "Repetí las indicaciones para confirmar.", hint: ["Two blocks straight, then left at the church?", "Sorry, can you repeat?"], model: ["So, two blocks straight, left at the church, and it's on the right?", "Sorry, could you say that again more slowly?"], expect: [K("two|blocks|straight|left|right|church|so|repeat|again|slowly")], next: "phone" },
        phone: { say: "Exactly. Do you want to use my phone to call anyone?", es: "Exacto. ¿Querés usar mi teléfono para llamar a alguien?", you: "Aceptá o rechazá con amabilidad.", hint: ["That's very kind, but I'm okay.", "Yes, please, just a quick call."], model: ["That's very kind, but I'm okay now. Thank you.", "Yes, please. Just a quick call to my friend."], open: 1, next: "end" },
        end: { say: "No problem. Have a good night!", es: "De nada. ¡Que tengas una buena noche!", end: true }
      }
    },
    {
      id: "doctor", cat: "Ciudad y servicios", title: "En el médico", sub: "Explicá qué te pasa", level: "A2+",
      who: { name: "Dr. Patel", role: "médica clínica en Londres", tone: "f", accent: "UK" },
      intro: "Estás de viaje y no te sentís bien. Vas a una guardia.",
      start: "start",
      turns: {
        start: { say: ["Hello, please have a seat. What brings you in today?", "Hi there. How can I help you today?"], es: "Hola, sentate. ¿Qué te trae por acá?", you: "Decí qué te pasa.", hint: ["I have a terrible headache.", "My stomach hurts."], model: ["I have a terrible headache and I feel dizzy.", "My stomach hurts and I can't eat."], expect: [K("headache|stomach|hurts|pain|fever|cough|dizzy|sick|feel|throat|back|ache|tired")], next: "since" },
        since: { say: "I'm sorry to hear that. When did it start?", es: "Lo siento. ¿Cuándo empezó?", you: "Decí cuándo empezó.", hint: ["Two days ago.", "Yesterday morning."], model: ["It started two days ago.", "Yesterday morning, after breakfast."], expect: [K("ago|yesterday|today|morning|night|days|week|since|started|last")], next: "scale" },
        scale: { say: "On a scale from one to ten, how bad is the pain?", es: "Del uno al diez, ¿qué tan fuerte es el dolor?", you: "Dá un número y describilo.", hint: ["About a seven.", "Six, but it gets worse at night."], model: ["About a seven. It gets worse at night.", "Five, more or less."], expect: [K("NUM|about|more or less|worse|better")], next: "meds" },
        meds: { say: "Are you taking any medication at the moment?", es: "¿Estás tomando alguna medicación?", you: "Respondé.", hint: ["No, I'm not.", "Only ibuprofen."], model: ["No, I'm not taking anything.", "Only some ibuprofen yesterday."], expect: [K("no|not|nothing|only|ibuprofen|paracetamol|aspirin|yes|pills|medicine")], next: "plan" },
        plan: { say: "Okay. I'll give you something for the pain. Drink lots of water and rest. Come back if it gets worse. Is that clear?", es: "Bien. Te doy algo para el dolor. Tomá mucha agua y descansá. Volvé si empeora. ¿Está claro?", you: "Confirmá lo que entendiste.", hint: ["Yes: water, rest, and come back if it gets worse.", "Sorry, how often should I take it?"], model: ["Yes. Lots of water, rest, and come back if it gets worse.", "Yes. How often should I take the pills?"], expect: [K("yes|water|rest|come back|worse|how often|clear|got it|okay|ok")], next: "end" },
        end: { say: "Every eight hours, with food. Get well soon.", es: "Cada ocho horas, con comida. Que te mejores.", end: true }
      }
    },
    {
      id: "bank", cat: "Ciudad y servicios", title: "Tarjeta bloqueada", sub: "Llamá al banco desde el exterior", level: "B1",
      who: { name: "Mike", role: "atención al cliente de un banco", tone: "m", accent: "US" },
      intro: "Tu tarjeta fue rechazada en un comercio de Estados Unidos. Llamás al banco.",
      start: "start",
      turns: {
        start: { say: "Thank you for calling. How can I help you today?", es: "Gracias por llamar. ¿En qué te puedo ayudar?", you: "Explicá el problema.", hint: ["My card was declined.", "I think my card is blocked."], model: ["Hi. My card was declined at a store and I think it's blocked.", "I'm traveling in the US and my card doesn't work."], expect: [K("card|declined|blocked|doesn'?t work|not working|rejected|problem")], next: "verify" },
        verify: { say: "I can help with that. For security, can you confirm your full name and date of birth?", es: "Te ayudo. Por seguridad, ¿me confirmás tu nombre completo y fecha de nacimiento?", you: "Decí tu nombre y una fecha de nacimiento (podés inventarla para practicar).", hint: ["My name is … and I was born on …", "It's … , born on the …"], model: ["My name is Maxi Defranchi, and I was born on the third of May.", "Maxi Defranchi. My date of birth is the tenth of June."], open: 4, next: "why" },
        why: { say: "Thank you. I see the card was blocked for an unusual transaction. Are you traveling right now?", es: "Gracias. Veo que la tarjeta se bloqueó por una operación inusual. ¿Estás de viaje?", you: "Confirmá dónde estás.", hint: ["Yes, I'm in Miami until Sunday.", "Yes, I'm in the US."], model: ["Yes, I'm in Miami until Sunday.", "Yes, I'm traveling in the United States for work."], expect: [K("yes|traveling|travelling|i'?m in|miami|us|united states|until|for work|vacation")], next: "recent" },
        recent: { say: "Did you try to pay three hundred dollars at an electronics store this morning?", es: "¿Intentaste pagar 300 dólares en una casa de electrónica esta mañana?", you: "Confirmá o negá la compra.", hint: ["Yes, that was me.", "No, that wasn't me!"], model: ["Yes, that was me. I was buying headphones.", "No, that wasn't me!"], expect: [K("yes|no|that was me|wasn'?t me|i did|i didn'?t|me")], branch: [{ if: K("wasn'?t|didn'?t|not me"), to: "fraud" }], next: "unblock" },
        unblock: { say: "Perfect. I've unblocked your card. You can try again now.", es: "Perfecto. Ya desbloqueé tu tarjeta. Podés intentar de nuevo.", you: "Agradecé y preguntá cómo evitarlo.", hint: ["Thanks. How can I avoid this next time?", "Great, thank you."], model: ["Thanks a lot. How can I avoid this next time?", "Great, thank you for your help."], open: 1, next: "end" },
        fraud: { say: "Then we'll cancel this card and send you a new one. Where are you staying?", es: "Entonces cancelamos esta tarjeta y te mandamos una nueva. ¿Dónde te alojás?", you: "Dá la dirección del hotel.", hint: ["At the Hilton in Miami Beach.", "At this address: …"], model: ["At the Hilton hotel in Miami Beach.", "I'm staying at a friend's house. I'll text you the address."], open: 2, next: "end" },
        end: { say: "All done. Is there anything else? No? Have a great day.", es: "Listo. ¿Algo más? ¿No? Que tengas un buen día.", end: true }
      }
    },
    {
      id: "sim", cat: "Ciudad y servicios", title: "Comprar un chip", sub: "Datos para el celular en el viaje", level: "A2",
      who: { name: "Tina", role: "vendedora de una tienda de celulares", tone: "f", accent: "US" },
      intro: "Necesitás datos para el celular durante tu viaje. Entrás a una tienda.",
      start: "start",
      turns: {
        start: { say: "Hi! What can I do for you?", es: "¡Hola! ¿Qué necesitás?", you: "Pedí un chip o eSIM con datos.", hint: ["I need a SIM card with data.", "Do you have prepaid eSIMs?"], model: ["Hi. I need a prepaid SIM card with data.", "Do you have eSIMs for tourists?"], expect: [K("sims?|esims?|card|data|prepaid|internet|phone|plan|need")], next: "stay" },
        stay: { say: "Sure. How long are you staying?", es: "Claro. ¿Cuánto tiempo te quedás?", you: "Respondé.", hint: ["Two weeks.", "Until the end of the month."], model: ["Two weeks.", "About ten days."], expect: [K("week|weeks|days|month|until|about|NUM")], next: "plan" },
        plan: { say: "We have fifteen gigs for thirty dollars, or unlimited for fifty. Which one?", es: "Tenemos 15 gigas por 30 dólares o ilimitado por 50. ¿Cuál?", you: "Elegí y explicá.", hint: ["Fifteen is enough.", "Unlimited, because I use maps a lot."], model: ["Fifteen gigs is enough for me.", "Unlimited, please. I use maps and video calls a lot."], expect: [K("fifteen|unlimited|first|second|cheaper|enough|NUM|gigs|one")], next: "passport" },
        passport: { say: "Great. I'll need your passport to register it.", es: "Bien. Necesito tu pasaporte para registrarlo.", you: "Entregalo y preguntá si te lo configura.", hint: ["Here you are. Can you set it up for me?", "Sure."], model: ["Here you are. Could you set it up for me?", "Sure. Will my WhatsApp keep working?"], open: 1, next: "end" },
        end: { say: "Of course. Give me two minutes and you're ready to go.", es: "Por supuesto. Dame dos minutos y listo.", end: true }
      }
    },
    {
      id: "gym", cat: "Ciudad y servicios", title: "Anotarte al gimnasio", sub: "Planes, horarios y objetivos", level: "A2",
      who: { name: "Ryan", role: "recepcionista de un gimnasio", tone: "m", accent: "US" },
      intro: "Querés anotarte en un gimnasio mientras vivís un tiempo afuera.",
      start: "start",
      turns: {
        start: { say: ["Hey! Interested in a membership?", "Hi there! First time here?"], es: "¡Hola! ¿Te interesa hacerte socio?", you: "Decí que sí y preguntá precios.", hint: ["Yes. How much is it?", "Yes, what plans do you have?"], model: ["Yes. How much is a monthly membership?", "Yes. What plans do you have?"], expect: [K("yes|how much|price|plans|membership|monthly|cost|interested")], next: "often" },
        often: { say: "It's forty a month. How often do you usually work out?", es: "Son 40 por mes. ¿Cada cuánto entrenás?", you: "Respondé con «… times a week».", hint: ["Three times a week.", "Almost every day."], model: ["Usually three times a week.", "Almost every day, in the morning."], expect: [K("times|week|every day|daily|once|twice|morning|evening|NUM|almost|usually")], next: "goal" },
        goal: { say: "Nice. What's your main goal?", es: "Bien. ¿Cuál es tu objetivo principal?", you: "Contá tu objetivo.", hint: ["I want to get stronger.", "To lose a little weight and feel better."], model: ["I want to get stronger and have more energy.", "I just want to stay healthy."], expect: [K("want|to|stronger|healthy|lose|weight|energy|muscle|fit|feel|better|run|stress")], next: "classes" },
        classes: { say: "We also have classes: yoga, spinning and boxing. Interested?", es: "También hay clases: yoga, spinning y boxeo. ¿Te interesa?", you: "Elegí una y preguntá el horario.", hint: ["Boxing sounds fun. When is it?", "Maybe yoga. What time?"], model: ["Boxing sounds fun. What days is it?", "Maybe yoga. What time are the classes?"], expect: [K("yoga|spinning|boxing|when|what time|days|sounds|maybe|no thanks|not really")], next: "end" },
        end: { say: "Monday and Thursday at seven. Let's get you signed up!", es: "Lunes y jueves a las siete. ¡Vamos a anotarte!", end: true }
      }
    },
    {
      id: "haircut", cat: "Ciudad y servicios", title: "En la peluquería", sub: "Explicá cómo querés el corte", level: "A2+",
      who: { name: "Lily", role: "peluquera en Londres", tone: "f", accent: "UK" },
      intro: "Necesitás un corte de pelo antes de una reunión importante.",
      start: "start",
      turns: {
        start: { say: "Hiya! What are we doing today?", es: "¡Hola! ¿Qué hacemos hoy?", you: "Pedí un corte.", hint: ["Just a trim, please.", "I'd like a haircut, not too short."], model: ["Just a trim, please. Not too short.", "I'd like a haircut and a beard trim."], expect: [K("trim|haircut|cut|short|beard|shave|hair|please")], next: "sides" },
        sides: { say: "Sure. How short on the sides?", es: "Dale. ¿Qué tan corto a los costados?", you: "Explicá. Podés usar números de máquina.", hint: ["Number two on the sides.", "Short on the sides, longer on top."], model: ["Number two on the sides, and a bit longer on top.", "Quite short on the sides, please."], expect: [K("short|number|sides|top|longer|shorter|NUM|bit|little|quite")], next: "top" },
        top: { say: "And on top, how much should I take off?", es: "¿Y arriba, cuánto saco?", you: "Indicá cuánto.", hint: ["Just a little.", "About two centimeters."], model: ["Just a little, please.", "About two centimeters."], expect: [K("little|bit|centimeters|centimetres|inch|inches|NUM|not much|half")], next: "beard" },
        beard: { say: "Lovely. Do you want me to do the beard too?", es: "Perfecto. ¿Querés que te haga la barba también?", you: "Respondé.", hint: ["Yes, please, just tidy it up.", "No, thanks."], model: ["Yes, please. Just tidy it up.", "No, thanks. Just the hair."], expect: [K("yes|no|tidy|trim|thanks|please|just")], next: "end" },
        end: { say: "Right, let's get started then.", es: "Bueno, empecemos.", end: true }
      }
    },
    {
      id: "supermarket", cat: "Ciudad y servicios", title: "En el supermercado", sub: "Preguntá dónde está cada cosa", level: "A2",
      who: { name: "Eddie", role: "repositor de un supermercado", tone: "m", accent: "US" },
      intro: "No encontrás lo que buscás en un supermercado de Estados Unidos.",
      start: "start",
      turns: {
        start: { say: "Hey, can I help you find something?", es: "Hola, ¿te ayudo a encontrar algo?", you: "Preguntá dónde está algo.", hint: ["Yes, where can I find the milk?", "Excuse me, where is the bread?"], model: ["Yes, please. Where can I find the oat milk?", "Excuse me, where is the bread?"], expect: [K("where|find|milk|bread|coffee|rice|pasta|eggs|cheese|meat|fruit|water|looking for")], next: "aisle" },
        aisle: { say: "That's in aisle seven, next to the cereal. Anything else?", es: "Está en el pasillo siete, al lado de los cereales. ¿Algo más?", you: "Preguntá por otro producto.", hint: ["Do you have yerba mate?", "Where are the cleaning products?"], model: ["Do you have yerba mate?", "Yes, where are the cleaning products?"], expect: [K("do you have|where|mate|cleaning|soap|shampoo|is there|are there|any")], next: "price" },
        price: { say: "We don't have mate, sorry. Cleaning stuff is at the back. Do you have a store card?", es: "Mate no tenemos, perdón. Lo de limpieza está al fondo. ¿Tenés tarjeta del súper?", you: "Respondé y preguntá por un descuento.", hint: ["No. Are there any discounts?", "No, I don't."], model: ["No, I don't. Are there any discounts without it?", "No. Can I get one today?"], expect: [K("no|yes|don'?t|discount|discounts|get one|card|sign up")], next: "bag" },
        bag: { say: "You can sign up at the checkout, it's free. Paper or plastic?", es: "Te podés anotar en la caja, es gratis. ¿Bolsa de papel o de plástico?", you: "Elegí.", hint: ["Paper, please.", "I have my own bag."], model: ["Paper, please.", "No bag, thanks. I have my own."], expect: [K("paper|plastic|own|no bag|my bag|none")], next: "end" },
        end: { say: "Great. Have a good one!", es: "Genial. ¡Que te vaya bien!", end: true }
      }
    },
    {
      id: "refund", cat: "Ciudad y servicios", title: "Devolver algo roto", sub: "Cambio o devolución del dinero", level: "B1",
      who: { name: "Megan", role: "atención al cliente de una tienda", tone: "f", accent: "US" },
      intro: "Compraste unos auriculares y dejaron de funcionar a los dos días.",
      start: "start",
      turns: {
        start: { say: "Hi, how can I help?", es: "Hola, ¿en qué te ayudo?", you: "Explicá el problema.", hint: ["I bought these headphones, but they don't work.", "These stopped working after two days."], model: ["Hi. I bought these headphones on Monday, but they stopped working.", "These headphones don't work. The left side has no sound."], expect: [K("bought|don'?t work|doesn'?t work|stopped|broken|no sound|problem|headphones")], next: "receipt" },
        receipt: { say: "I'm sorry. Do you have the receipt?", es: "Lo siento. ¿Tenés el ticket?", you: "Respondé.", hint: ["Yes, here it is.", "I have it on my email."], model: ["Yes, here it is.", "I have it in my email. Can I show you on my phone?"], expect: [K("yes|here|receipt|email|phone|no|lost")], next: "option" },
        option: { say: "Thanks. Would you like a refund or an exchange?", es: "Gracias. ¿Querés que te devolvamos el dinero o cambiarlos?", you: "Elegí y explicá.", hint: ["A refund, please.", "An exchange for a better model."], model: ["A refund, please. I'd prefer to buy another brand.", "An exchange is fine, but I want a different model."], expect: [K("refund|exchange|money back|change|different|another|new one|swap")], next: "how" },
        how: { say: "No problem. The refund goes back to your card in three to five days. Is that okay?", es: "No hay problema. El reintegro vuelve a tu tarjeta en tres a cinco días. ¿Está bien?", you: "Aceptá o pedí otra cosa.", hint: ["That's fine, thanks.", "Could I get cash instead?"], model: ["That's fine, thank you.", "Could I get cash instead? I'm leaving the country."], open: 1, next: "end" },
        end: { say: "All done. Sorry again for the trouble.", es: "Listo. Perdón otra vez por la molestia.", end: true }
      }
    },
    {
      id: "delivery", cat: "Ciudad y servicios", title: "El delivery no llegó", sub: "Reclamá por teléfono", level: "B1",
      who: { name: "Sean", role: "atención al cliente de una app de comida", tone: "m", accent: "US" },
      intro: "Pediste comida hace una hora y nunca llegó. Llamás al servicio de atención.",
      start: "start",
      turns: {
        start: { say: "Thanks for calling. What seems to be the problem?", es: "Gracias por llamar. ¿Cuál es el problema?", you: "Explicá que el pedido no llegó.", hint: ["My order didn't arrive.", "I ordered an hour ago and I'm still waiting."], model: ["My order didn't arrive. I ordered an hour ago.", "I'm still waiting for my food. The app says it was delivered."], expect: [K("order|didn'?t arrive|never arrived|waiting|hour|delivered|food|late|still")], next: "number" },
        number: { say: "I'm sorry about that. Can I have your order number?", es: "Disculpá. ¿Me pasás el número de pedido?", you: "Dictá el número.", hint: ["It's four seven two nine.", "Let me check… it's …"], model: ["Sure. It's four seven two nine.", "Let me check. It's B as in boy, eight, one, five."], open: 1, next: "addr" },
        addr: { say: "I see it. The driver says nobody answered. Can you confirm your address?", es: "Lo veo. El repartidor dice que nadie atendió. ¿Me confirmás la dirección?", you: "Confirmá la dirección y aclarás que estabas.", hint: ["It's 25 Main Street, apartment 3B. I was home all the time.", "I was home! My address is …"], model: ["It's twenty-five Main Street, apartment three B. I was home the whole time.", "I was home! The bell doesn't work, so he should call me."], expect: [K("street|apartment|avenue|address|home|bell|NUM|was|call")], next: "fix" },
        fix: { say: "Thanks. I can send the food again or give you a full refund. Which do you prefer?", es: "Gracias. Puedo reenviar la comida o devolverte todo el dinero. ¿Qué preferís?", you: "Elegí.", hint: ["A refund, please. It's too late now.", "Send it again, please."], model: ["A full refund, please. It's too late for dinner now.", "Please send it again, and ask the driver to call me."], expect: [K("refund|send|again|money|prefer|both|call")], next: "end" },
        end: { say: "Done. I've also added a ten dollar credit to your account. Sorry again!", es: "Listo. También te sumé diez dólares de crédito. ¡Perdón otra vez!", end: true }
      }
    },
    {
      id: "flat", cat: "Ciudad y servicios", title: "Visitar un departamento", sub: "Preguntá todo antes de alquilar", level: "B1",
      who: { name: "Mr. Hughes", role: "dueño de un departamento en alquiler", tone: "m", accent: "UK" },
      intro: "Vas a ver un departamento para alquilar durante seis meses.",
      start: "start",
      turns: {
        start: { say: "Come in. So, how long are you planning to stay?", es: "Pasá. ¿Cuánto tiempo pensás quedarte?", you: "Respondé.", hint: ["About six months.", "Until June."], model: ["About six months, maybe a year.", "Until the end of June."], expect: [K("months|month|year|until|about|maybe|NUM|weeks")], next: "work" },
        work: { say: "And what do you do?", es: "¿Y a qué te dedicás?", you: "Contá tu trabajo.", hint: ["I work in communications.", "I'm a … for …"], model: ["I work in digital communications. I work from home some days.", "I'm a communications consultant."], expect: [K("i work|i'?m|communications|consultant|manager|lawyer|work from home|job")], next: "ask" },
        ask: { say: "Lovely. This is the living room. Any questions about the flat?", es: "Bien. Este es el living. ¿Alguna pregunta sobre el departamento?", you: "Hacé dos preguntas (servicios, calefacción, mascotas, internet).", hint: ["Are bills included?", "Is the internet fast?"], model: ["Are the bills included in the rent?", "How fast is the internet? I work from home."], expect: [K("bills|included|internet|heating|pets|noise|neighbors|neighbours|deposit|how|is|are|can i")], next: "money" },
        money: { say: "Bills are included except electricity. The rent is twelve hundred a month, plus one month deposit.", es: "Los servicios están incluidos menos la luz. El alquiler es 1200 por mes más un mes de depósito.", you: "Intentá negociar un poco.", hint: ["Could you do eleven hundred?", "Is the price negotiable?"], model: ["Is there any chance you could do eleven hundred?", "Is the price negotiable if I stay for a year?"], expect: [K("could you|negotiable|discount|less|lower|chance|eleven|hundred|cheaper|year")], next: "when" },
        when: { say: "Maybe, if you stay a full year. When would you like to move in?", es: "Tal vez, si te quedás un año. ¿Cuándo te querés mudar?", you: "Decí la fecha.", hint: ["On the first of next month.", "As soon as possible."], model: ["On the first of next month, if that works.", "As soon as possible. Next week?"], expect: [K("first|next|month|week|soon|possible|monday|tuesday|wednesday|thursday|friday|NUM")], next: "end" },
        end: { say: "That works. I'll send you the contract by email.", es: "Me sirve. Te mando el contrato por mail.", end: true }
      }
    },
    {
      id: "neighbor", cat: "Vida social", title: "Tu vecina", sub: "Charla en el ascensor", level: "A2",
      who: { name: "Ruth", role: "tu vecina del cuarto piso", tone: "f", accent: "US" },
      intro: "Te cruzás con tu vecina en el ascensor de tu edificio nuevo.",
      start: "start",
      turns: {
        start: { say: ["Hi! Are you the new neighbor?", "Hello! I don't think we've met. Did you just move in?"], es: "¡Hola! ¿Sos el vecino nuevo?", you: "Presentate.", hint: ["Yes! I'm Maxi, I live in 5B.", "Yes, I moved in last week."], model: ["Yes! I'm Maxi. I just moved into 5B.", "Yes, I moved in last week. Nice to meet you."], expect: [K("yes|i'?m|moved|new|live|nice to meet|apartment|flat")], next: "from" },
        from: { say: "Welcome! I'm Ruth. Where are you from?", es: "¡Bienvenido! Soy Ruth. ¿De dónde sos?", you: "Respondé y agregá un detalle.", hint: ["From Argentina. I'm here for work.", "From Buenos Aires."], model: ["From Buenos Aires. I'm here for work for a few months.", "I'm from Argentina."], expect: [K("from|argentina|buenos aires|i'?m|work")], next: "tip" },
        tip: { say: "Oh, nice! If you need anything, just knock. Do you know where the trash goes?", es: "¡Qué bueno! Si necesitás algo, golpeá nomás. ¿Sabés dónde va la basura?", you: "Decí que no y pedí que te explique.", hint: ["No, I don't. Where does it go?", "Not really. Can you tell me?"], model: ["No, I don't. Where does it go?", "Not really. Could you tell me?"], expect: [K("no|don'?t|where|tell me|not really|could you|can you|yes")], next: "package" },
        package: { say: "In the basement, and recycling on Tuesdays. Oh, and I think I have a package of yours!", es: "En el sótano, y el reciclaje los martes. ¡Ah, y creo que tengo un paquete tuyo!", you: "Agradecé y combiná para buscarlo.", hint: ["Really? Thank you! Can I get it later?", "Oh, thanks! When can I pick it up?"], model: ["Really? Thank you so much! Can I pick it up tonight?", "Oh, thanks! I'll come by after work."], open: 2, next: "end" },
        end: { say: "Sure, any time after six. See you later!", es: "Claro, después de las seis cuando quieras. ¡Nos vemos!", end: true }
      }
    },
    {
      id: "plans", cat: "Vida social", title: "Armar una salida", sub: "Proponé un plan para el finde", level: "A2+",
      who: { name: "Ella", role: "una amiga de la oficina", tone: "f", accent: "US" },
      intro: "Es viernes a la tarde. Ella te pregunta por el fin de semana.",
      start: "start",
      turns: {
        start: { say: ["Any plans for the weekend?", "So, what are you doing this weekend?"], es: "¿Tenés planes para el fin de semana?", you: "Respondé con «I'm going to…» o «Not yet».", hint: ["Not yet. What about you?", "I'm going to …"], model: ["Not yet. What about you?", "I'm going to rest and maybe watch a movie."], open: 2, next: "idea" },
        idea: { say: "I was thinking of going to a food market on Saturday. Want to come?", es: "Pensaba ir a un mercado de comida el sábado. ¿Querés venir?", you: "Aceptá con entusiasmo.", hint: ["I'd love to!", "Sounds great! What time?"], model: ["I'd love to! What time are you going?", "Sounds great. Count me in!"], expect: [K("love to|sounds|great|yes|sure|count me in|what time|why not|of course")], next: "time" },
        time: { say: "Around eleven? We could have lunch there.", es: "¿A eso de las once? Podemos almorzar ahí.", you: "Confirmá o proponé otra hora.", hint: ["Eleven is perfect.", "Could we make it twelve?"], model: ["Eleven is perfect.", "Could we make it twelve? I have the gym in the morning."], expect: [K("eleven|twelve|perfect|fine|great|could we|make it|later|earlier|ok|okay")], next: "meet" },
        meet: { say: "Sure. Should we meet there or at the station?", es: "Dale. ¿Nos encontramos ahí o en la estación?", you: "Elegí el lugar.", hint: ["Let's meet at the station.", "I'll meet you there."], model: ["Let's meet at the station. It's easier for me.", "I'll meet you there."], expect: [K("station|there|meet|let'?s|i'?ll|entrance|corner")], next: "end" },
        end: { say: "Perfect. I'll text you the address. See you Saturday!", es: "Perfecto. Te mando la dirección. ¡Nos vemos el sábado!", end: true }
      }
    },
    {
      id: "party", cat: "Vida social", title: "En una fiesta", sub: "Charlá con alguien que no conocés", level: "A2+",
      who: { name: "Leo", role: "un invitado en una fiesta", tone: "m", accent: "UK" },
      intro: "Estás en el cumpleaños de una compañera de trabajo y no conocés a casi nadie.",
      start: "start",
      turns: {
        start: { say: ["Hi! How do you know Sarah?", "Hey there. Are you a friend of Sarah's?"], es: "¡Hola! ¿De dónde conocés a Sarah?", you: "Explicá de dónde la conocés.", hint: ["We work together.", "She's my colleague."], model: ["We work together. She's on my team.", "She's my colleague. And you?"], expect: [K("work|colleague|team|together|friend|met|office|school")], next: "drink" },
        drink: { say: "Ah, nice. I went to school with her. Can I get you a drink?", es: "Ah, qué bien. Yo fui al colegio con ella. ¿Te traigo algo para tomar?", you: "Aceptá o pedí algo sin alcohol.", hint: ["A beer, please.", "Just a soda, thanks."], model: ["Sure, a beer would be great.", "Just a soda, thanks. I'm driving."], expect: [K("beer|wine|soda|water|coke|juice|thanks|please|sure|no|nothing|driving")], next: "music" },
        music: { say: "Here you go. What do you think of the music?", es: "Acá tenés. ¿Qué te parece la música?", you: "Opiná y contá qué música te gusta.", hint: ["It's great. I love this song.", "Not my style. I prefer rock."], model: ["It's great! I love this song.", "It's not really my style. I prefer Argentine rock."], open: 3, next: "free" },
        free: { say: "Fair enough! So what do you do for fun?", es: "¡Me parece justo! ¿Y qué hacés para divertirte?", you: "Contá tus hobbies con «I like + -ing».", hint: ["I like playing football and cooking.", "I enjoy reading."], model: ["I like playing football and cooking for friends.", "I enjoy traveling and trying new food."], expect: [K("like|love|enjoy|playing|reading|cooking|watching|traveling|travelling|going|football|music|gym|running")], next: "end" },
        end: { say: "Cool. Oh, they're bringing the cake! Come on, let's sing.", es: "¡Buenísimo! Ah, traen la torta. Vamos a cantar.", end: true }
      }
    },
    {
      id: "family", cat: "Vida social", title: "Hablar de tu familia", sub: "Hermanos, padres y tradiciones", level: "A2",
      who: { name: "Molly", role: "una compañera de curso", tone: "f", accent: "UK" },
      intro: "En un descanso del curso, Molly te pregunta por tu familia.",
      start: "start",
      turns: {
        start: { say: ["Do you have any brothers or sisters?", "So, is your family big?"], es: "¿Tenés hermanos?", you: "Respondé con detalle.", hint: ["Yes, I have one brother.", "No, I'm an only child."], model: ["Yes, I have one older brother and a younger sister.", "No, I'm an only child."], expect: [K("yes|no|brother|brothers|sister|sisters|only child|siblings|older|younger")], next: "parents" },
        parents: { say: "And where do your parents live?", es: "¿Y dónde viven tus padres?", you: "Respondé.", hint: ["In Buenos Aires.", "My mom lives in …"], model: ["They live in Buenos Aires, near my house.", "My mom lives in Buenos Aires and my dad in Córdoba."], expect: [K("live|lives|in|buenos aires|near|city|argentina|mom|dad|mother|father|parents")], next: "often" },
        often: { say: "Do you see them often?", es: "¿Los ves seguido?", you: "Respondé con frecuencia.", hint: ["Every Sunday.", "Not very often."], model: ["Yes, every Sunday. We have lunch together.", "Not very often, because I'm very busy."], expect: [K("every|often|sunday|week|month|once|twice|not very|always|sometimes|usually|never")], next: "trad" },
        trad: { say: "That's lovely. Do you have any family traditions?", es: "Qué lindo. ¿Tienen alguna tradición familiar?", you: "Contá una tradición (asado, cumpleaños, fiestas).", hint: ["We have an asado every Sunday.", "On Christmas we …"], model: ["We have a big barbecue, an asado, every Sunday.", "At Christmas we eat late and stay up until two."], open: 4, next: "end" },
        end: { say: "That sounds amazing. I'd love to try an asado one day!", es: "Suena increíble. ¡Me encantaría probar un asado algún día!", end: true }
      }
    },
    {
      id: "series", cat: "Vida social", title: "Recomendar una serie", sub: "Contá de qué se trata y por qué verla", level: "B1",
      who: { name: "Josh", role: "un amigo de otro país", tone: "m", accent: "US" },
      intro: "Josh busca algo para ver esta noche y te pide recomendaciones.",
      start: "start",
      turns: {
        start: { say: "I need something new to watch. Any recommendations?", es: "Necesito algo nuevo para ver. ¿Alguna recomendación?", you: "Recomendá una serie o película.", hint: ["You should watch …", "Have you seen …?"], model: ["You should watch The Bear. It's amazing.", "Have you seen Succession? It's my favorite."], expect: [K("should|watch|have you seen|recommend|try|series|show|movie|film|it'?s")], next: "about" },
        about: { say: "I haven't seen it. What's it about?", es: "No la vi. ¿De qué se trata?", you: "Contá de qué trata en presente.", hint: ["It's about a chef who …", "It's about a family that …"], model: ["It's about a young chef who goes back to Chicago to run his family's restaurant.", "It's about a rich family that fights for control of a company."], expect: [K("it'?s about|about|who|that|story|family|man|woman|guy|chef|people")], next: "why" },
        why: { say: "Sounds interesting. Why do you like it so much?", es: "Suena interesante. ¿Por qué te gusta tanto?", you: "Dá dos razones.", hint: ["Because the acting is great and …", "I love the characters."], model: ["Because the acting is great and every episode is very intense.", "I love the characters, and the dialogues are really smart."], expect: [K("because|love|like|acting|characters|story|funny|intense|smart|real|music")], next: "arg" },
        arg: { say: "Cool. Is there any good Argentine movie I should see?", es: "¡Bien! ¿Hay alguna buena película argentina que tenga que ver?", you: "Recomendá una película argentina.", hint: ["Yes, you should see …", "Wild Tales is great."], model: ["Yes, you should see Wild Tales. It's really funny.", "The Secret in Their Eyes. It won an Oscar."], open: 3, next: "end" },
        end: { say: "Awesome, I'm adding both to my list. Thanks!", es: "¡Genial, las agrego a mi lista! ¡Gracias!", end: true }
      }
    },
    {
      id: "theft", cat: "Imprevistos", title: "Te robaron el celular", sub: "Hacé la denuncia en la comisaría", level: "B1",
      who: { name: "Officer Hall", role: "policía en Londres", tone: "f", accent: "UK" },
      intro: "Te robaron el celular en el metro. Vas a la comisaría a hacer la denuncia.",
      start: "start",
      turns: {
        start: { say: "Good afternoon. How can I help you?", es: "Buenas tardes. ¿En qué te puedo ayudar?", you: "Explicá qué pasó.", hint: ["Someone stole my phone.", "I want to report a theft."], model: ["I want to report a theft. Someone stole my phone on the tube.", "My phone was stolen this morning."], expect: [K("stole|stolen|theft|robbed|report|phone|wallet|bag|someone")], next: "when" },
        when: { say: "I'm sorry. When and where did it happen?", es: "Lo siento. ¿Cuándo y dónde pasó?", you: "Dá hora y lugar en pasado.", hint: ["About an hour ago, on the tube.", "This morning, at Oxford Circus station."], model: ["About an hour ago, on the Central line near Oxford Circus.", "This morning, at around nine, on the bus."], expect: [K("ago|morning|afternoon|today|yesterday|on the|at|station|tube|bus|train|street|around")], next: "how" },
        how: { say: "Did you see the person? Can you describe what happened?", es: "¿Viste a la persona? ¿Podés describir qué pasó?", you: "Contá lo que pasó.", hint: ["The train was full and someone pushed me.", "I didn't see anything."], model: ["The train was very full. Someone pushed me, and then my phone was gone.", "No, I didn't see anything. I noticed it when I got off."], open: 5, next: "phone" },
        phone: { say: "Can you describe the phone?", es: "¿Podés describir el teléfono?", you: "Describilo.", hint: ["It's a black iPhone with a blue case.", "A Samsung, grey, quite new."], model: ["It's a black iPhone fifteen with a blue case.", "It's a grey Samsung. It's almost new."], expect: [K("iphone|samsung|black|white|grey|gray|blue|case|new|old|phone|it'?s")], next: "contact" },
        contact: { say: "Okay. How can we contact you if we find it?", es: "Bien. ¿Cómo te contactamos si aparece?", you: "Dá un contacto alternativo.", hint: ["By email: …", "You can call my hotel."], model: ["By email, please. I don't have a phone now.", "You can call my hotel. Here's the number."], expect: [K("email|hotel|call|number|address|contact|friend|by")], next: "end" },
        end: { say: "Here's your crime reference number. You'll need it for your insurance.", es: "Este es el número de denuncia. Lo vas a necesitar para el seguro.", end: true }
      }
    },
    {
      id: "overcharge", cat: "Imprevistos", title: "Te cobraron de más", sub: "Revisá la cuenta con el mozo", level: "A2+",
      who: { name: "Nick", role: "mozo en un bar de Nueva York", tone: "m", accent: "US" },
      intro: "Revisás la cuenta y te cobraron cosas que no pediste.",
      start: "start",
      turns: {
        start: { say: "Here's your check. Everything okay?", es: "Acá está la cuenta. ¿Todo bien?", you: "Señalá que hay un error con amabilidad.", hint: ["Excuse me, I think there's a mistake.", "Sorry, this isn't right."], model: ["Excuse me, I think there's a mistake on the check.", "Sorry, I don't think this is right."], expect: [K("mistake|wrong|error|isn'?t right|not right|excuse me|sorry|think")], next: "what" },
        what: { say: "Oh, let me see. What's wrong?", es: "Uh, a ver. ¿Qué está mal?", you: "Explicá qué no pediste.", hint: ["We didn't order the wine.", "We only had two beers, not four."], model: ["We didn't order this bottle of wine.", "We only had two beers, not four."], expect: [K("didn'?t|only|not|order|ordered|had|wine|beer|beers|dessert|NUM")], next: "fix" },
        fix: { say: "You're right, that's from another table. I'm so sorry. Let me fix that.", es: "Tenés razón, es de otra mesa. Perdón. Ya lo corrijo.", you: "Respondé con amabilidad.", hint: ["No problem, it happens.", "Thanks, no worries."], model: ["No problem, it happens.", "Thanks, don't worry."], open: 1, next: "tip" },
        tip: { say: "Here's the new check. Would you like to add a tip?", es: "Acá está la cuenta nueva. ¿Querés agregar propina?", you: "Decidí la propina. En Estados Unidos se deja entre 15 y 20 %.", hint: ["Yes, twenty percent.", "Fifteen percent, please."], model: ["Yes, let's do twenty percent.", "Fifteen percent, please."], expect: [K("yes|no|percent|NUM|tip|fifteen|twenty|eighteen")], next: "end" },
        end: { say: "Thank you so much. Sorry again, and have a great night!", es: "Muchísimas gracias. Perdón de nuevo, ¡y que tengas una linda noche!", end: true }
      }
    },
    {
      id: "missed", cat: "Imprevistos", title: "Perdiste la conexión", sub: "Tu vuelo llegó tarde y perdiste el siguiente", level: "B1",
      who: { name: "Claire", role: "agente de la aerolínea en Madrid", tone: "f", accent: "UK" },
      intro: "Tu primer vuelo se atrasó y perdiste la conexión. Vas al mostrador de transbordos.",
      start: "start",
      turns: {
        start: { say: "Hi, are you here for a missed connection?", es: "Hola, ¿venís por una conexión perdida?", you: "Explicá la situación.", hint: ["Yes, my first flight was late.", "Yes, I missed my flight to Buenos Aires."], model: ["Yes. My first flight was late and I missed my flight to Buenos Aires.", "Yes, I missed my connection because of the delay."], expect: [K("yes|missed|late|delay|delayed|connection|flight")], next: "next" },
        next: { say: "Let me check. The next flight is tomorrow morning. Is that okay?", es: "Déjame ver. El próximo vuelo es mañana a la mañana. ¿Te sirve?", you: "Preguntá si hay algo antes.", hint: ["Is there anything earlier?", "Tomorrow is fine."], model: ["Is there anything earlier, maybe with another airline?", "Tomorrow is fine, but I need a hotel."], expect: [K("earlier|anything|another|tonight|today|tomorrow|fine|hotel|airline|other")], next: "hotel" },
        hotel: { say: "Unfortunately not. But we'll cover your hotel and dinner tonight.", es: "Lamentablemente no. Pero te cubrimos el hotel y la cena de esta noche.", you: "Preguntá por el traslado y el equipaje.", hint: ["How do I get to the hotel?", "What about my suitcase?"], model: ["Thank you. How do I get to the hotel?", "What happens with my suitcase?"], expect: [K("how|what|where|suitcase|luggage|bag|hotel|shuttle|bus|taxi|get to")], next: "end" },
        end: { say: "There's a free shuttle at door five, and your bag will go on tomorrow's flight. Again, sorry.", es: "Hay un traslado gratis en la puerta cinco y tu valija va en el vuelo de mañana. Perdón otra vez.", end: true }
      }
    },
    {
      id: "bosscall", cat: "Escucha activa", listen: true, title: "Cambio de planes", sub: "Tu jefe te da varias instrucciones por teléfono", level: "B1",
      who: { name: "David", role: "tu jefe, por teléfono", tone: "m", accent: "US" },
      intro: "Tu jefe te llama apurado con varios cambios. Escuchá bien: después te pregunta qué entendiste.",
      start: "start",
      lesson: { title: "Entender instrucciones por teléfono", points: [{ en: "Did you get that?", es: "¿Entendiste? ¿Lo anotaste?" }, { en: "Let me check: Thursday at three, right?", es: "Dejame confirmar: el jueves a las tres, ¿no?" }, { en: "Could you repeat the time, please?", es: "¿Me repetís la hora, por favor?" }], tip: "Cuando te dan instrucciones, repetilas en voz alta: «So, Thursday at three in room B». Confirmás que entendiste y el otro te corrige si no." },
      turns: {
        start: { say: "Hey, it's David. Listen, there's been a change of plans. The meeting with the client isn't tomorrow anymore. It's on Thursday at three. Did you get that? When's the meeting?", es: "Hola, soy David. Escuchá, hubo un cambio de planes. La reunión con el cliente ya no es mañana: es el jueves a las tres. ¿Entendiste? ¿Cuándo es la reunión?", focus: "el día y la hora de la reunión", you: "Decí cuándo es la reunión.", hint: ["It's on … at …", "On Thursday at …"], model: ["Got it. It's on Thursday at three.", "Thursday at three o'clock."], need: [K("thursday"), K("three|3")], key: [{ en: "there's been a change of plans", es: "hubo un cambio de planes" }, { en: "isn't tomorrow anymore", es: "ya no es mañana" }, { en: "Did you get that?", es: "¿Entendiste?" }], next: "where" },
        where: { say: "Great. It's in room B, on the second floor, not in my office. Where is it?", es: "Bien. Es en la sala B, en el segundo piso, no en mi oficina. ¿Dónde es?", focus: "el lugar", you: "Decí dónde es la reunión.", hint: ["In room …, on the … floor."], model: ["In room B, on the second floor.", "It's in room B."], need: [K("room b|b|second floor|2nd floor")], key: [{ en: "on the second floor", es: "en el segundo piso" }], next: "tasks" },
        tasks: { say: "Perfect. Before the meeting, I need you to do two things. First, print the sales report. Second, call Mr. Ross and confirm he's coming. What are the two things?", es: "Perfecto. Antes de la reunión necesito que hagas dos cosas. Primero, imprimí el informe de ventas. Segundo, llamá al señor Ross y confirmá que viene. ¿Cuáles son las dos cosas?", focus: "las dos tareas", you: "Repetí las dos tareas.", hint: ["Print the … and call …", "First …, then …"], model: ["Print the sales report and call Mr. Ross to confirm.", "First print the report, then call Mr. Ross."], need: [K("print|report"), K("call|ross|phone")], key: [{ en: "I need you to…", es: "necesito que (vos)…" }, { en: "confirm he's coming", es: "confirmar que viene" }], next: "noon" },
        noon: { say: "Exactly. Oh, and Mr. Ross is only free in the morning, so call him before twelve. When should you call him?", es: "Exacto. Ah, y el señor Ross solo está libre a la mañana, así que llamalo antes de las doce. ¿Cuándo lo tenés que llamar?", focus: "hasta qué hora podés llamar", you: "Decí cuándo lo tenés que llamar.", hint: ["Before …", "In the …"], model: ["Before twelve, in the morning.", "In the morning, before noon."], need: [K("before|morning|twelve|12|noon")], key: [{ en: "he's only free in the morning", es: "solo está libre a la mañana" }], next: "end" },
        end: { say: "Perfect. Thanks, you're a lifesaver. See you on Thursday!", es: "Perfecto. Gracias, me salvaste. ¡Nos vemos el jueves!", end: true }
      }
    },
    {
      id: "busdirections", cat: "Escucha activa", listen: true, title: "Cómo llegar en colectivo", sub: "Indicaciones largas con números y direcciones", level: "B1",
      who: { name: "Aisha", role: "una señora en una parada de Londres", tone: "f", accent: "UK" },
      intro: "Preguntaste cómo llegar al Museo de Ciencias. Te explican todo de una: escuchá número, paradas y dirección.",
      start: "start",
      lesson: { title: "Entender indicaciones", points: [{ en: "take the number 42 bus", es: "tomá el colectivo 42" }, { en: "get off at the fifth stop", es: "bajate en la quinta parada" }, { en: "across the road", es: "cruzando la calle" }, { en: "opposite the park", es: "enfrente del parque" }], tip: "En unas indicaciones hay tres datos que siempre se olvidan: el número, cuántas paradas y de qué lado. Repetilos en voz baja mientras te hablan." },
      turns: {
        start: { say: "Oh, the Science Museum? That's a bit far from here. You'll need to take the number 42 bus. The stop is just across the road, next to the bank. Which bus do you need?", es: "¿El Museo de Ciencias? Está un poco lejos. Tenés que tomar el 42. La parada está cruzando la calle, al lado del banco. ¿Qué colectivo tenés que tomar?", focus: "el número de colectivo", you: "Decí qué colectivo.", hint: ["The number …"], model: ["The number 42.", "I need the 42."], need: [K("42|forty two|forty-two|fourty two")], key: [{ en: "a bit far", es: "un poco lejos" }, { en: "across the road", es: "cruzando la calle" }, { en: "next to the bank", es: "al lado del banco" }], next: "stops" },
        stops: { say: "That's it. Stay on the bus for about fifteen minutes and get off at the fifth stop, Kensington Road. How many stops?", es: "Eso. Quedate en el colectivo unos quince minutos y bajate en la quinta parada, Kensington Road. ¿Cuántas paradas?", focus: "en qué parada te bajás", you: "Decí en qué parada te bajás.", hint: ["At the … stop."], model: ["Five stops. I get off at Kensington Road.", "At the fifth stop."], need: [K("five|5|fifth|kensington")], key: [{ en: "get off", es: "bajarse" }, { en: "stay on the bus", es: "quedate arriba del colectivo" }], next: "side" },
        side: { say: "Right. From there it's a short walk, about five minutes. Go straight and you'll see it on your left, opposite a big park. Which side is it on?", es: "Bien. Desde ahí es una caminata corta, unos cinco minutos. Seguí derecho y lo vas a ver a tu izquierda, enfrente de un parque grande. ¿De qué lado está?", focus: "de qué lado está el museo", you: "Decí de qué lado está.", hint: ["On my …"], model: ["On my left, opposite a park.", "On the left."], need: [K("left")], key: [{ en: "a short walk", es: "una caminata corta" }, { en: "opposite", es: "enfrente de" }], next: "pay" },
        pay: { say: "And one more thing: you can't pay with cash on the bus. Only with a card or your phone. How can you pay?", es: "Y una cosa más: en el colectivo no se puede pagar en efectivo. Solo con tarjeta o con el celular. ¿Cómo podés pagar?", focus: "cómo se paga", you: "Decí cómo podés pagar.", hint: ["With a … or my …"], model: ["With a card or my phone.", "Only with a card or contactless."], need: [K("card|phone|contactless|mobile")], key: [{ en: "you can't pay with cash", es: "no se puede pagar en efectivo" }], next: "end" },
        end: { say: "Lovely. Enjoy the museum!", es: "¡Buenísimo! Que disfrutes el museo.", end: true }
      }
    },
    {
      id: "gatechange", cat: "Escucha activa", listen: true, title: "Cambio de puerta", sub: "Un anuncio del aeropuerto con varios datos", level: "B1",
      who: { name: "Laura", role: "agente en la puerta de embarque", tone: "f", accent: "US" },
      intro: "Estás en el aeropuerto de Miami esperando tu vuelo. Suena un anuncio y después una agente te habla.",
      start: "start",
      lesson: { title: "Anuncios en el aeropuerto", points: [{ en: "the departure gate has changed to…", es: "la puerta de embarque cambió a…" }, { en: "boarding will start at…", es: "el embarque empieza a las…" }, { en: "boarding group", es: "grupo de embarque" }, { en: "check a carry-on bag", es: "despachar el equipaje de mano" }], tip: "En los anuncios el dato importante viene después de «changed to», «now boarding» o «delayed by». Esperá esas palabras." },
      turns: {
        start: { say: "Attention please. Passengers on flight AR 1303 to Buenos Aires: the departure gate has changed from gate 12 to gate 28. Excuse me, sir, you're on this flight, right? Did you hear the new gate?", es: "Atención. Pasajeros del vuelo AR 1303 a Buenos Aires: la puerta cambió de la 12 a la 28. Disculpe, usted va en este vuelo, ¿no? ¿Escuchó la puerta nueva?", focus: "la puerta nueva", you: "Decí la puerta nueva.", hint: ["Yes, gate …"], model: ["Yes, it's gate 28 now.", "Gate 28."], need: [K("28|twenty eight|twenty-eight")], key: [{ en: "the departure gate has changed", es: "cambió la puerta de embarque" }], next: "board" },
        board: { say: "That's right. Boarding will start at nine forty, so you have about half an hour. What time does boarding start?", es: "Correcto. El embarque empieza a las 9:40, así que tiene una media hora. ¿A qué hora empieza el embarque?", focus: "la hora de embarque", you: "Decí a qué hora empieza el embarque.", hint: ["At …"], model: ["At nine forty.", "Boarding starts at 9:40."], need: [K("9 40|nine forty|940|9 forty")], key: [{ en: "boarding will start at", es: "el embarque empieza a las" }, { en: "about half an hour", es: "una media hora" }], next: "group" },
        group: { say: "You're in boarding group four, so you'll board after groups one, two and three. Which group are you in?", es: "Usted está en el grupo cuatro: embarca después de los grupos uno, dos y tres. ¿En qué grupo está?", focus: "tu grupo de embarque", you: "Decí tu grupo.", hint: ["Group …"], model: ["Group four.", "I'm in group four."], need: [K("four|4")], key: [{ en: "you'll board after…", es: "va a embarcar después de…" }], next: "bag" },
        bag: { say: "Also, the flight is full, so we're checking carry-on bags for free here at the gate. Would you like to check yours?", es: "Además, el vuelo está lleno, así que despachamos el equipaje de mano gratis acá en la puerta. ¿Quiere despachar el suyo?", focus: "qué te ofrece", you: "Respondé si querés despachar tu bolso.", hint: ["Yes, please. Is it free?", "No, thanks. I'll keep it."], model: ["Yes, please, if it's free.", "No thanks, I'll keep it with me."], expect: [K("yes|no|please|thanks|keep|check|free")], key: [{ en: "the flight is full", es: "el vuelo está lleno" }, { en: "for free", es: "gratis" }], next: "end" },
        end: { say: "Perfect. Here's your tag. See you at nine forty!", es: "Perfecto. Acá tiene la etiqueta. ¡Nos vemos a las 9:40!", end: true }
      }
    },
    {
      id: "recipe", cat: "Escucha activa", listen: true, title: "Una receta por teléfono", sub: "Cantidades, tiempos y pasos", level: "B1",
      who: { name: "Rose", role: "la mamá de un amigo", tone: "f", accent: "US" },
      intro: "Le pediste a Rose su receta de panqueques. Te la dicta rápido: prestá atención a cantidades y tiempos.",
      start: "start",
      lesson: { title: "Instrucciones y cantidades", points: [{ en: "a pinch of salt", es: "una pizca de sal" }, { en: "don't overmix it", es: "no lo mezcles de más" }, { en: "flip them", es: "dalos vuelta" }, { en: "on medium heat", es: "a fuego medio" }], tip: "Las recetas usan el verbo solo, sin sujeto: «Mix», «Add», «Cook». Es como nuestro «mezclá», «agregá», «cociná»." },
      turns: {
        start: { say: "Okay, write this down. For the pancakes you need two eggs, a cup of flour, a cup of milk and a pinch of salt. How many eggs?", es: "Bueno, anotá. Para los panqueques necesitás dos huevos, una taza de harina, una taza de leche y una pizca de sal. ¿Cuántos huevos?", focus: "cuántos huevos", you: "Decí cuántos huevos.", hint: ["… eggs."], model: ["Two eggs.", "You need two eggs."], need: [K("two|2")], key: [{ en: "write this down", es: "anotá esto" }, { en: "a cup of flour", es: "una taza de harina" }, { en: "a pinch of salt", es: "una pizca de sal" }], next: "milk" },
        milk: { say: "Good. And remember: one cup of milk, not two. How much milk?", es: "Bien. Y acordate: una taza de leche, no dos. ¿Cuánta leche?", focus: "cuánta leche", you: "Decí cuánta leche.", hint: ["One …"], model: ["One cup of milk.", "Just one cup."], need: [K("one|1|a cup")], key: [{ en: "not two", es: "no dos" }], next: "mix" },
        mix: { say: "Mix everything for about two minutes, but don't overmix it, or the pancakes get hard. What happens if you mix too much?", es: "Mezclá todo unos dos minutos, pero no de más, porque si no los panqueques quedan duros. ¿Qué pasa si mezclás de más?", focus: "qué pasa si mezclás de más", you: "Explicá qué pasa.", hint: ["They get …"], model: ["They get hard.", "The pancakes get hard."], need: [K("hard|tough")], key: [{ en: "don't overmix it", es: "no lo mezcles de más" }, { en: "or … get hard", es: "si no, quedan duros" }], next: "flip" },
        flip: { say: "Then cook them on medium heat. When you see little bubbles on top, flip them. It takes about one minute on each side. When do you flip them?", es: "Después cocinalos a fuego medio. Cuando veas burbujitas arriba, dalos vuelta. Es más o menos un minuto de cada lado. ¿Cuándo los das vuelta?", focus: "cuándo darlos vuelta", you: "Decí cuándo los das vuelta.", hint: ["When I see …"], model: ["When I see little bubbles on top.", "After about a minute, when there are bubbles."], need: [K("bubbles?|minute")], key: [{ en: "on medium heat", es: "a fuego medio" }, { en: "flip them", es: "dalos vuelta" }, { en: "on each side", es: "de cada lado" }], next: "end" },
        end: { say: "You've got it! Send me a photo when they're ready.", es: "¡Ya está! Mandame una foto cuando estén listos.", end: true }
      }
    },
    {
      id: "numbersmeeting", cat: "Escucha activa", listen: true, title: "Reunión con números", sub: "Resultados, subas y causas", level: "B1+",
      who: { name: "Victor", role: "analista de datos", tone: "m", accent: "UK" },
      intro: "Reunión de resultados. Victor habla rápido y con muchos números. Prestá atención a qué subió, qué bajó y por qué.",
      start: "start",
      lesson: { title: "Hablar de números y cambios", points: [{ en: "it went up from 20 to 30 cents", es: "subió de 20 a 30 centavos" }, { en: "fifteen percent more than in June", es: "un quince por ciento más que en junio" }, { en: "cost per click", es: "costo por clic" }, { en: "I suggest we…", es: "propongo que…" }], tip: "Para hablar de cambios: «went up» (subió), «went down» (bajó), «from … to …» (de … a …), «by ten percent» (un diez por ciento)." },
      turns: {
        start: { say: "Okay, quick update. Last month our videos reached two point four million people. That's fifteen percent more than in June. How many people did we reach?", es: "Bueno, actualización rápida. El mes pasado los videos llegaron a 2,4 millones de personas. Es un 15 % más que en junio. ¿A cuántas personas llegamos?", focus: "a cuántas personas llegaron", you: "Decí el número.", hint: ["… million people."], model: ["Two point four million people.", "About 2.4 million, fifteen percent more than in June."], need: [K("2 4|two point four|2 point 4|million")], key: [{ en: "quick update", es: "actualización rápida" }, { en: "that's 15 percent more than…", es: "es un 15 % más que…" }], next: "problem" },
        problem: { say: "But here's the problem. The cost per click went up from twenty cents to thirty cents. What went up?", es: "Pero acá está el problema. El costo por clic subió de 20 a 30 centavos. ¿Qué subió?", focus: "qué subió", you: "Decí qué subió y cuánto.", hint: ["The cost per … went up from … to …"], model: ["The cost per click went up from twenty to thirty cents.", "The cost per click."], need: [K("cost|click|price")], key: [{ en: "here's the problem", es: "acá está el problema" }, { en: "went up from … to …", es: "subió de … a …" }], next: "why" },
        why: { say: "We think it's because more brands are advertising before the holidays, so there's more competition. Why do we think it happened?", es: "Creemos que es porque más marcas están haciendo publicidad antes de las fiestas, así que hay más competencia. ¿Por qué creemos que pasó?", focus: "la causa", you: "Explicá la causa con «because».", hint: ["Because more … are …"], model: ["Because more brands are advertising before the holidays.", "Because there's more competition before the holidays."], need: [K("brands?|holidays?|advertis\\w*|competition")], key: [{ en: "more brands are advertising", es: "más marcas hacen publicidad" }, { en: "competition", es: "competencia" }], next: "suggest" },
        suggest: { say: "So, what do you suggest we do this month?", es: "Entonces, ¿qué proponés que hagamos este mes?", you: "Proponé algo con «I suggest…» o «We could…».", hint: ["I suggest we …", "We could …"], model: ["I suggest we focus on organic videos until the holidays end.", "We could reduce the budget and test cheaper platforms."], open: 5, key: [{ en: "what do you suggest we do?", es: "¿qué proponés que hagamos?" }], next: "end" },
        end: { say: "Good idea. Let's try that and compare the numbers next week.", es: "Buena idea. Probemos eso y comparamos los números la semana que viene.", end: true }
      }
    },
    {
      id: "career", cat: "Escucha activa", listen: true, title: "La historia de una colega", sub: "Escuchá su trayectoria y contá la tuya", level: "B1",
      who: { name: "Nadia", role: "fundadora de una productora de podcasts", tone: "f", accent: "UK" },
      intro: "En un evento, Nadia te cuenta su historia. Escuchá los datos: después te pregunta qué recordás.",
      start: "start",
      lesson: { title: "Contar una trayectoria", points: [{ en: "I'm originally from…", es: "soy de… (de origen)" }, { en: "I moved to Berlin in 2015", es: "me mudé a Berlín en 2015" }, { en: "I started my own company", es: "armé mi propia empresa" }, { en: "enough about me!", es: "¡basta de hablar de mí!" }], tip: "Para contar tu historia alcanza con tres verbos en pasado: «I started…», «then I moved…», «now I…». Y los años: «in twenty fifteen»." },
      turns: {
        start: { say: "So, I'm originally from Sweden, but I moved to Berlin in 2015 for a job in journalism. Where did I move to?", es: "Soy de Suecia, pero me mudé a Berlín en 2015 por un trabajo de periodismo. ¿A dónde me mudé?", focus: "a qué ciudad se mudó", you: "Decí a dónde se mudó.", hint: ["You moved to …"], model: ["You moved to Berlin.", "To Berlin, in 2015."], need: [K("berlin")], key: [{ en: "originally from", es: "de origen" }, { en: "I moved to…", es: "me mudé a…" }], next: "year" },
        year: { say: "Exactly. And do you remember what year that was?", es: "Exacto. ¿Y te acordás qué año fue?", focus: "el año", you: "Decí el año.", hint: ["In …"], model: ["In 2015.", "It was in twenty fifteen."], need: [K("2015|twenty fifteen|two thousand fifteen|two thousand and fifteen")], key: [{ en: "do you remember…?", es: "¿te acordás…?" }], next: "company" },
        company: { say: "After five years as a journalist, I started my own company. Now we make podcasts for brands, and we're a team of twenty people. What does my company do?", es: "Después de cinco años como periodista, armé mi propia empresa. Ahora hacemos podcasts para marcas y somos un equipo de veinte personas. ¿Qué hace mi empresa?", focus: "a qué se dedica la empresa", you: "Decí qué hace su empresa.", hint: ["It makes … for …"], model: ["It makes podcasts for brands.", "Your company makes podcasts."], need: [K("podcasts?")], key: [{ en: "I started my own company", es: "armé mi propia empresa" }, { en: "a team of twenty people", es: "un equipo de veinte personas" }], next: "team" },
        team: { say: "Right. And how big is the team now?", es: "Eso. ¿Y qué tan grande es el equipo ahora?", focus: "cuántas personas", you: "Decí cuántas personas son.", hint: ["… people."], model: ["Twenty people.", "A team of twenty."], need: [K("twenty|20")], next: "you" },
        you: { say: "Anyway, enough about me! How did you start working in communications?", es: "¡Bueno, basta de hablar de mí! ¿Cómo empezaste a trabajar en comunicación?", you: "Contá tu historia en pasado (dos o tres frases).", hint: ["I studied …, then I …", "I started in … in …"], model: ["I studied law, but I started working in social media in 2015.", "I started in a small agency, and then I moved to the government."], open: 6, key: [{ en: "enough about me", es: "basta de hablar de mí" }], next: "end" },
        end: { say: "What a story! We should definitely keep in touch.", es: "¡Qué historia! Tenemos que seguir en contacto.", end: true }
      }
    },
    {
      id: "clinicphone", cat: "Escucha activa", listen: true, title: "Turno médico por teléfono", sub: "Día, hora, qué llevar y dónde es", level: "B1",
      who: { name: "Deborah", role: "recepcionista de una clínica", tone: "f", accent: "US" },
      intro: "Llamás para pedir un turno. La recepcionista te da varios datos seguidos: confirmalos uno por uno.",
      start: "start",
      lesson: { title: "Confirmar datos por teléfono", points: [{ en: "Does that work for you?", es: "¿Te sirve?" }, { en: "fill in some forms", es: "completar unos formularios" }, { en: "don't forget to bring…", es: "no te olvides de traer…" }, { en: "Let me confirm: Tuesday at ten fifteen.", es: "Confirmo: martes a las diez y cuarto." }], tip: "Al teléfono, antes de cortar, repetí siempre día, hora y lugar. Es lo que más se entiende mal." },
      turns: {
        start: { say: "Hello, Riverside Clinic. Doctor Smith can see you on Tuesday at ten fifteen. Does that work for you? Just to check you got it: what day and time did I say?", es: "Hola, Clínica Riverside. La doctora Smith te puede atender el martes a las 10:15. ¿Te sirve? Para chequear: ¿qué día y hora te dije?", focus: "el día y la hora", you: "Decí el día y la hora del turno.", hint: ["On … at …"], model: ["Tuesday at ten fifteen. That works for me.", "On Tuesday at 10:15."], need: [K("tuesday"), K("10 15|ten fifteen|1015|quarter past ten|10 fifteen")], key: [{ en: "can see you", es: "te puede atender" }, { en: "Does that work for you?", es: "¿Te sirve?" }], next: "early" },
        early: { say: "Perfect. Please arrive fifteen minutes early to fill in some forms. How early should you arrive?", es: "Perfecto. Llegá quince minutos antes para completar unos formularios. ¿Con cuánta anticipación tenés que llegar?", focus: "cuánto antes llegar", you: "Decí cuánto antes tenés que llegar.", hint: ["… minutes early."], model: ["Fifteen minutes early.", "A quarter of an hour before."], need: [K("fifteen|15|quarter")], key: [{ en: "arrive fifteen minutes early", es: "llegar quince minutos antes" }, { en: "fill in some forms", es: "completar unos formularios" }], next: "bring" },
        bring: { say: "And don't forget to bring your passport and your insurance card. What do you need to bring?", es: "Y no te olvides de traer el pasaporte y la credencial del seguro. ¿Qué tenés que traer?", focus: "qué tenés que llevar", you: "Decí las dos cosas.", hint: ["My … and my …"], model: ["My passport and my insurance card.", "The passport and the insurance card."], need: [K("passport"), K("insurance|card")], key: [{ en: "don't forget to bring…", es: "no te olvides de traer…" }, { en: "insurance card", es: "credencial del seguro médico" }], next: "floor" },
        floor: { say: "Great. The clinic is on the fourth floor of the Riverside building, next to the pharmacy. Which floor is it on?", es: "Bien. La clínica está en el cuarto piso del edificio Riverside, al lado de la farmacia. ¿En qué piso está?", focus: "el piso", you: "Decí el piso.", hint: ["On the … floor."], model: ["On the fourth floor, next to the pharmacy.", "The fourth floor."], need: [K("fourth|4th|four|4")], key: [{ en: "next to the pharmacy", es: "al lado de la farmacia" }], next: "end" },
        end: { say: "Wonderful. See you on Tuesday. Bye now!", es: "Buenísimo. Nos vemos el martes. ¡Chau!", end: true }
      }
    },
    {
      id: "flatrules", cat: "Escucha activa", listen: true, title: "Las reglas del departamento", sub: "Código, wifi, basura y ruidos", level: "B1",
      who: { name: "Greg", role: "dueño de un departamento en Manchester", tone: "m", accent: "UK" },
      intro: "Llegás al departamento que alquilaste en Manchester. Greg te explica todo de corrido y con palabras británicas.",
      start: "start",
      lesson: { title: "Inglés británico de todos los días", points: [{ en: "flat", es: "departamento (en EE.UU. «apartment»)" }, { en: "rubbish", es: "basura (en EE.UU. «trash»)" }, { en: "keep the noise down", es: "no hacer ruido" }, { en: "downstairs", es: "el de abajo" }], tip: "En Inglaterra vas a escuchar «flat», «rubbish», «queue» y «neighbour»; en Estados Unidos, «apartment», «trash», «line» y «neighbor»." },
      turns: {
        start: { say: "Right, a few things about the flat. The door code is four, seven, nine, two. Can you repeat the code for me?", es: "Bueno, un par de cosas del departamento. El código de la puerta es 4, 7, 9, 2. ¿Me repetís el código?", focus: "el código de la puerta", you: "Repetí el código.", hint: ["It's …"], model: ["Four, seven, nine, two.", "It's 4792."], need: [K("4 7 9 2|four seven nine two|4792|47 92|forty seven ninety two")], key: [{ en: "a few things about the flat", es: "un par de cosas del departamento" }, { en: "door code", es: "código de la puerta" }], next: "wifi" },
        wifi: { say: "Brilliant. The wifi network is called Greenhouse, and the password is on the fridge. Where's the password?", es: "Genial. La red de wifi se llama Greenhouse y la clave está en la heladera. ¿Dónde está la clave?", focus: "dónde está la clave del wifi", you: "Decí dónde está la clave.", hint: ["It's on the …"], model: ["On the fridge.", "The password is on the fridge."], need: [K("fridge|refrigerator")], key: [{ en: "the password is on the fridge", es: "la clave está en la heladera" }], next: "rubbish" },
        rubbish: { say: "The rubbish goes out on Monday night, and the recycling on Thursday. When does the rubbish go out?", es: "La basura se saca el lunes a la noche y el reciclaje el jueves. ¿Cuándo se saca la basura?", focus: "qué día va la basura", you: "Decí qué día.", hint: ["On … night."], model: ["On Monday night.", "Monday night, and recycling on Thursday."], need: [K("monday")], key: [{ en: "the rubbish goes out", es: "se saca la basura" }, { en: "recycling", es: "reciclaje" }], next: "noise" },
        noise: { say: "And please keep the noise down after ten. The neighbour downstairs has a baby. Why should you be quiet?", es: "Y por favor no hagas ruido después de las diez. La vecina de abajo tiene un bebé. ¿Por qué tenés que hacer silencio?", focus: "por qué hacer silencio", you: "Explicá por qué.", hint: ["Because the neighbour …"], model: ["Because the neighbour downstairs has a baby.", "Because of the baby downstairs."], need: [K("baby|neighbou?r")], key: [{ en: "keep the noise down", es: "no hacer ruido" }, { en: "the neighbour downstairs", es: "la vecina de abajo" }], next: "end" },
        end: { say: "Cheers. Enjoy your stay in Manchester!", es: "Gracias. ¡Que disfrutes Manchester!", end: true }
      }
    },
    {
      id: "britishslang", cat: "Escucha activa", listen: true, title: "Un colega británico", sub: "Expresiones que no están en los libros", level: "B1+",
      who: { name: "Harry", role: "compañero de trabajo en Londres", tone: "m", accent: "UK" },
      intro: "Harry habla rápido y usa expresiones muy británicas. Escuchá el sentido: después te pregunta qué quiso decir.",
      start: "start",
      lesson: { title: "Expresiones británicas", points: [{ en: "I'm knackered", es: "estoy muerto (de cansancio)" }, { en: "it's not my cup of tea", es: "no es lo mío, no me gusta" }, { en: "I reckon…", es: "me parece que…" }, { en: "let's call it a day", es: "terminemos por hoy" }, { en: "fancy a pint?", es: "¿vamos por una cerveza?" }], tip: "No hace falta que las uses, pero sí que las entiendas: en Inglaterra aparecen en cualquier charla." },
      turns: {
        start: { say: "Honestly, I'm knackered. We've been working on this presentation all day. How do you think I feel?", es: "La verdad, estoy muerto. Estuvimos todo el día con esta presentación. ¿Cómo creés que me siento?", focus: "cómo se siente", you: "Decí cómo se siente él.", hint: ["You're …"], model: ["You're very tired.", "You feel exhausted."], need: [K("tired|exhausted|knackered|sleepy|dead")], key: [{ en: "I'm knackered", es: "estoy muerto de cansancio" }, { en: "all day", es: "todo el día" }], next: "design" },
        design: { say: "And to be honest, the new design isn't really my cup of tea. Do I like it?", es: "Y para ser sincero, el diseño nuevo no es lo mío. ¿Me gusta?", focus: "si le gusta el diseño", you: "Decí si le gusta o no.", hint: ["No, you don't …"], model: ["No, you don't like it.", "Not really. It's not your cup of tea."], need: [K("no|not|don'?t|doesn'?t")], key: [{ en: "not my cup of tea", es: "no es lo mío" }, { en: "to be honest", es: "para ser sincero" }], next: "finish" },
        finish: { say: "The boss wants it by Friday, but I reckon we can finish it tomorrow if we crack on. When do I think we can finish?", es: "El jefe lo quiere para el viernes, pero me parece que lo terminamos mañana si le metemos. ¿Cuándo creo que podemos terminar?", focus: "cuándo terminan", you: "Decí cuándo cree que terminan.", hint: ["…, if we …"], model: ["Tomorrow, if we work hard.", "You think we can finish tomorrow."], need: [K("tomorrow")], key: [{ en: "I reckon", es: "me parece" }, { en: "if we crack on", es: "si le metemos" }], next: "pint" },
        pint: { say: "Right, I think we should call it a day. Fancy a pint at the pub?", es: "Bueno, creo que terminemos por hoy. ¿Vamos por una cerveza al pub?", focus: "qué te propone", you: "Aceptá o rechazá con amabilidad.", hint: ["Sure, why not?", "I'd love to, but …"], model: ["Sure, why not? I could use a drink.", "I'd love to, but I'm really tired too."], expect: [K("sure|yes|love|why not|sorry|but|no|maybe|next time|great|sounds")], key: [{ en: "let's call it a day", es: "terminemos por hoy" }, { en: "fancy a pint?", es: "¿vamos por una cerveza?" }], next: "end" },
        end: { say: "Brilliant. Let's go!", es: "¡Genial! Vamos.", end: true }
      }
    },
    {
      id: "newsbrief", cat: "Escucha activa", listen: true, title: "Las noticias del día", sub: "Clima, escuelas, trenes y recomendaciones", level: "B1",
      who: { name: "Martin", role: "locutor de radio", tone: "m", accent: "US" },
      intro: "Estás de viaje y escuchás la radio a la mañana. Prestá atención a qué va a pasar y qué recomiendan.",
      start: "start",
      lesson: { title: "Noticias y futuro con «will»", points: [{ en: "a big storm is coming", es: "se viene una tormenta fuerte" }, { en: "schools will be closed", es: "las escuelas van a estar cerradas" }, { en: "delays of up to thirty minutes", es: "demoras de hasta treinta minutos" }, { en: "the city recommends staying at home", es: "la ciudad recomienda quedarse en casa" }], tip: "Las noticias usan mucho «will» para el futuro: «schools will be closed», «trains will run». Y «up to» quiere decir «hasta»." },
      turns: {
        start: { say: "Good morning, this is Martin with your news. A big storm is coming tonight, with strong winds and heavy rain. What's coming tonight?", es: "Buen día, les habla Martin con las noticias. Esta noche se viene una tormenta fuerte, con mucho viento y lluvia intensa. ¿Qué viene esta noche?", focus: "qué va a pasar esta noche", you: "Decí qué viene.", hint: ["A … with …"], model: ["A big storm, with strong winds and heavy rain.", "A storm is coming tonight."], need: [K("storm|rain|winds?")], key: [{ en: "heavy rain", es: "lluvia intensa" }, { en: "strong winds", es: "vientos fuertes" }], next: "schools" },
        schools: { say: "Because of the storm, all schools will be closed tomorrow, but offices will stay open. Will schools be open tomorrow?", es: "Por la tormenta, mañana todas las escuelas van a estar cerradas, pero las oficinas siguen abiertas. ¿Van a abrir las escuelas mañana?", focus: "si abren las escuelas", you: "Respondé.", hint: ["No, they'll be …"], model: ["No, schools will be closed.", "No, but offices will stay open."], need: [K("no|closed|not|won'?t")], key: [{ en: "because of the storm", es: "por la tormenta" }, { en: "will stay open", es: "van a seguir abiertas" }], next: "trains" },
        trains: { say: "Trains will run, but with delays of up to thirty minutes. What about the trains?", es: "Los trenes van a funcionar, pero con demoras de hasta treinta minutos. ¿Qué pasa con los trenes?", focus: "qué pasa con los trenes", you: "Explicá qué pasa con los trenes.", hint: ["They'll run, but …"], model: ["They will run, but with delays of up to thirty minutes.", "There will be delays."], need: [K("delays?|late|thirty|30")], key: [{ en: "up to", es: "hasta" }, { en: "delays", es: "demoras" }], next: "advice" },
        advice: { say: "The city recommends staying at home if possible and charging your phone tonight. What does the city recommend?", es: "La ciudad recomienda quedarse en casa si es posible y cargar el celular esta noche. ¿Qué recomienda la ciudad?", focus: "qué recomiendan", you: "Decí las dos recomendaciones.", hint: ["To stay … and to charge …"], model: ["To stay at home and charge your phone.", "Staying home and charging your phone tonight."], need: [K("stay|home"), K("charg\\w*|phone")], key: [{ en: "if possible", es: "si es posible" }, { en: "charging your phone", es: "cargar el celular" }], next: "end" },
        end: { say: "That's all for now. Stay safe out there!", es: "Eso es todo por ahora. ¡Cuídense!", end: true }
      }
    },
    {
      id: "supplier", cat: "Escucha activa", listen: true, title: "Negociar con un proveedor", sub: "Precio, descuentos, condiciones y plazos", level: "B1+",
      who: { name: "Frank", role: "proveedor de remeras para una campaña", tone: "m", accent: "US" },
      intro: "Necesitás remeras para una campaña. Frank te pasa precio y condiciones: escuchá bien los «if» y los «but».",
      start: "start",
      lesson: { title: "Condiciones con «if»", points: [{ en: "eight dollars each", es: "ocho dólares cada una" }, { en: "if you order more than five hundred…", es: "si pedís más de quinientas…" }, { en: "within thirty days", es: "dentro de los treinta días" }, { en: "Deal.", es: "Trato hecho." }], tip: "En una negociación, las condiciones vienen después de «if», «but» y «as long as». Ahí está la letra chica." },
      turns: {
        start: { say: "Okay, so the t-shirts are eight dollars each. But if you order more than five hundred, I can give you a ten percent discount. When do you get the discount?", es: "Bueno, las remeras salen ocho dólares cada una. Pero si pedís más de quinientas, te hago un diez por ciento de descuento. ¿Cuándo tenés el descuento?", focus: "cuándo hay descuento", you: "Decí la condición del descuento.", hint: ["If I order more than …"], model: ["If I order more than five hundred.", "When we order more than 500 t-shirts."], need: [K("500|five hundred|more than")], key: [{ en: "eight dollars each", es: "ocho dólares cada una" }, { en: "a ten percent discount", es: "un diez por ciento de descuento" }], next: "pay" },
        pay: { say: "There's one condition, though. You have to pay within thirty days. What's the condition?", es: "Eso sí, hay una condición: tenés que pagar dentro de los treinta días. ¿Cuál es la condición?", focus: "la condición", you: "Decí la condición.", hint: ["We have to pay within …"], model: ["We have to pay within thirty days.", "Paying in thirty days."], need: [K("pay\\w*|30|thirty|days")], key: [{ en: "There's one condition, though.", es: "Eso sí, hay una condición." }, { en: "within thirty days", es: "dentro de los treinta días" }], next: "delivery" },
        delivery: { say: "Delivery takes three weeks, or ten days if you pay for express shipping. How long does express shipping take?", es: "La entrega tarda tres semanas, o diez días si pagás envío rápido. ¿Cuánto tarda el envío rápido?", focus: "cuánto tarda el envío rápido", you: "Decí cuánto tarda.", hint: ["… days."], model: ["Ten days.", "Express takes ten days, standard three weeks."], need: [K("ten|10")], key: [{ en: "delivery takes three weeks", es: "la entrega tarda tres semanas" }, { en: "express shipping", es: "envío rápido" }], next: "decide" },
        decide: { say: "So, what would you like to do?", es: "Entonces, ¿qué querés hacer?", you: "Decidí: cantidad, pago y envío.", hint: ["We'll order … and …", "Could you …?"], model: ["We'll order six hundred, pay within thirty days, and use standard delivery.", "Could you give us fifteen percent if we order a thousand?"], open: 6, key: [{ en: "what would you like to do?", es: "¿qué querés hacer?" }], next: "end" },
        end: { say: "Deal. I'll send you the contract this afternoon.", es: "Trato hecho. Te mando el contrato a la tarde.", end: true }
      }
    }
  ];

  /* pedir que repita: no cuenta como error */
  const REPAIR = /\b(sorry|pardon|excuse me|repeat|again|slow(?:ly|er)?|what did you say|don'?t understand|didn'?t (?:get|catch|understand)|one more time)\b|^\s*what\s*\??\s*$/i;
  const ACK = ["Okay.", "I see.", "Great.", "Nice.", "Got it."];
  const SORRY = ["Sorry, I didn't catch that.", "Sorry, could you say that again?", "Hmm, I'm not sure I understood."];

  /* errores típicos de hispanohablantes: patrón, corrección y explicación */
  const AUX = /^(did|does|do|can|could|will|would|should|must|may|might|to|let|make|made|help|helped|didn't|doesn't|won't|can't)$/i;
  const BASE_V = { went: "go", saw: "see", had: "have", came: "come", did: "do", made: "make", took: "take", ate: "eat", got: "get", was: "be", were: "be", bought: "buy", said: "say", told: "tell", met: "meet", left: "leave", felt: "feel", thought: "think" };
  const FIXES = [
    { re: /\bi have (\d+|[a-z]+(?:-[a-z]+)?) years( old)?\b/i, fix: (m) => `I'm ${m[1]}${m[2] ? " years old" : ""}`, why: "La edad va con «to be»: I'm 40." },
    { re: /\bi(?:'m| am) agree\b/i, fix: () => "I agree", why: "«Agree» ya es un verbo: no lleva «am»." },
    { re: /\bpeople is\b/i, fix: () => "people are", why: "«People» es plural." },
    { re: /\b(he|she|it) don'?t\b/i, fix: (m) => `${m[1]} doesn't`, why: "Con he, she, it se usa «doesn't»." },
    { re: /(?:\b(\w+)\s+)?\b(he|she|it) have\b/i, fix: (m) => AUX.test(m[1] || "") ? null : `${m[2]} has`, why: "Con he, she, it se usa «has»." },
    { re: /(?:\b(\w+)\s+)?\b(he|she) (work|live|like|want|need|know|think|play|say|go)\b/i, fix: (m) => AUX.test(m[1] || "") ? null : `${m[2]} ${m[3] === "go" ? "goes" : m[3] === "say" ? "says" : m[3] + "s"}`, why: "Con he, she, it el verbo en presente lleva -s." },
    { re: /\bdid (you|he|she|they|we|i) (went|saw|had|came|did|made|took|ate|got|bought|said|told|met|left|thought)\b/i, fix: (m) => `did ${m[1]} ${BASE_V[m[2].toLowerCase()]}`, why: "Después de «did» el verbo va en presente." },
    { re: /\b(didn'?t|did not) (went|saw|had|came|made|took|ate|got|bought|said|told|met|left|thought)\b/i, fix: (m) => `${m[1]} ${BASE_V[m[2].toLowerCase()]}`, why: "Después de «didn't» el verbo va en presente." },
    { re: /\bsince (\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|a few) (years|months|weeks|days|hours)\b/i, fix: (m) => `for ${m[1]} ${m[2]}`, why: "Para una duración va «for». «Since» va con un momento: since 2020." },
    { re: /\b(i|we|they) (?:am|are|'m|'re) (living|working|studying) here since\b/i, fix: (m) => `${m[1]} have been ${m[2]} here since`, why: "Para algo que empezó antes y sigue: «have been … since»." },
    { re: /\bexplain me\b/i, fix: () => "explain to me", why: "Se dice «explain to me» o «explain it to me»." },
    { re: /\bsay me\b/i, fix: () => "tell me", why: "Para «decime» se usa «tell me»." },
    { re: /\bmore (better|bigger|easier|faster|cheaper|worse)\b/i, fix: (m) => m[1], why: "«Better» ya es comparativo: no lleva «more»." },
    { re: /\bin the weekend\b/i, fix: () => "on the weekend", why: "Se dice «on the weekend» (o «at the weekend» en inglés británico)." },
    { re: /\bmake a question\b/i, fix: () => "ask a question", why: "Las preguntas se «ask», no se «make»." },
    { re: /\bassist(?:ed)? (?:to )?(?:the |a )?(meeting|conference|event|class|course)\b/i, fix: (m) => `attend the ${m[1]}`, why: "«Assist» es ayudar. Asistir a algo es «attend»." },
    { re: /\bdepends? of\b/i, fix: () => "depends on", why: "Se dice «depend on»." },
    { re: /\bmarried with\b/i, fix: () => "married to", why: "Se dice «married to»." },
    { re: /\barrived? to\b/i, fix: () => "arrive in / at", why: "Se llega «in» una ciudad o país y «at» un lugar: arrive in London, arrive at the airport." },
    { re: /^\s*is (very |so |really )?(\w+)/i, fix: (m) => `It's ${m[1] || ""}${m[2]}`, why: "En inglés la oración siempre lleva sujeto: «It's cold», no «Is cold»." },
    { re: /\bhow is called\b/i, fix: () => "what is it called", why: "Para «cómo se llama» se dice «what is it called»." },
    { re: /\b(go|went|come|came) to home\b/i, fix: (m) => `${m[1]} home`, why: "«Home» va sin «to»: I went home." },
    { re: /\blose the (bus|train|plane|flight)\b/i, fix: (m) => `miss the ${m[1]}`, why: "Perder el colectivo o el vuelo es «miss»." },
    { re: /\bwhat means\b/i, fix: () => "what does … mean", why: "Las preguntas con verbos comunes llevan «does»: What does it mean?" },
    { re: /\bi like very much\b/i, fix: () => "I really like", why: "«Very much» va al final: I like it very much. O «I really like it»." },
    { re: /\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, fix: (m) => `on ${m[1]}`, why: "Con los días se usa «on»: on Monday." },
    { re: /\bat the night\b/i, fix: () => "at night", why: "Se dice «at night», sin «the»." },
    { re: /\bi want that you\b/i, fix: () => "I want you to", why: "Se dice «I want you to come», no «I want that you come»." },
    { re: /\bi'?m boring\b/i, fix: () => "I'm bored", why: "«Boring» es aburrido como cosa o persona. Si estás aburrido, «I'm bored»." },
    { re: /\bwin (money|a salary)\b/i, fix: (m) => `earn ${m[1]}`, why: "Ganar plata trabajando es «earn»; «win» es ganar un premio." },
    { re: /\bi have (hungry|thirsty|cold|hot|sleepy)\b/i, fix: (m) => `I'm ${m[1] === "sleepy" ? "sleepy" : m[1]}`, why: "Hambre, sed, frío y calor van con «to be»: I'm hungry." },
    { re: /\bthe (people|life|money|time) (is|are)\b(?=.*\b(in general|always|everywhere)\b)/i, fix: (m) => `${m[1]} ${m[2]}`, why: "Para hablar en general no va «the»." }
  ];

  /* charla libre con Claude */
  const AI_TOPICS = [
    { id: "free", title: "Lo que quieras", en: "anything Maxi wants to talk about. Start by asking how his day is going." },
    { id: "work", title: "Tu trabajo", en: "his job in digital communications for the Argentine government: campaigns, his team, a typical day." },
    { id: "weekend", title: "Tu fin de semana", en: "what he did last weekend and his plans for the next one. Encourage past tense and future." },
    { id: "travel", title: "Viajes", en: "trips he has taken and places he would like to visit." },
    { id: "ba", title: "Buenos Aires", en: "life in Buenos Aires: neighborhoods, food, football, culture." },
    { id: "job", title: "Entrevista de trabajo", en: "a job interview for a communications role at an international company. You are the interviewer: ask one interview question at a time." },
    { id: "news", title: "Algo que leíste", en: "a piece of news or an article he read recently. Ask him to explain it simply." }
  ];
  const AI_PERSONAS = { free: "Alex", work: "Sarah", weekend: "Nora", travel: "Emma", ba: "Liam", job: "Ms. Carter", news: "Tom" };
  function aiSystem(topic, persona) {
    return `You are ${persona}, a friendly English conversation partner inside a pronunciation app. The learner is Maxi, an adult from Buenos Aires, Argentina. His English is A2+ and he is working toward B1. He works in digital communications.
Topic: ${topic}
His messages are automatic speech-recognition transcripts of what he said out loud. Ignore capitalization and punctuation. If a word looks strange, it may be a recognition error caused by his accent: guess the intended word and keep going.
Rules:
- Speak naturally but simply: at most two short sentences per turn, under 30 words, everyday vocabulary, A2-B1 grammar.
- React briefly to what he said, then ask exactly one simple question to keep the conversation going.
- Your spoken reply is always in English. Never translate it.
- If his last message has one important grammar or vocabulary mistake, add a single short correction in Rioplatense Spanish (use "vos"), quoting his words and the correct English, for example: «I have 40 years» → «I'm 40»: la edad va con «to be». Ignore anything that could be a recognition error. If there is no important mistake, add no correction.
Answer in exactly this format:
<reply>your spoken reply</reply>
<fix>the correction, only if needed</fix>`;
  }
  function handoffPrompt(topicTitle) {
    return `Quiero practicar conversación en inglés por voz. Soy Maxi, de Buenos Aires, nivel A2+ (apunto a B1) y trabajo en comunicación digital. Hablame en inglés simple, con frases cortas y una sola pregunta por vez. Si cometo un error importante, corregime en una línea en español y seguí la charla. Si te pido, explicame cómo poner la boca para algún sonido. Tema: ${topicTitle}. Empezá vos con un saludo y una pregunta.`;
  }

  /* nombres que no son nombres: «I'm fine», «I'm from…» */
  const NOT_NAME = /^(fine|good|great|well|from|here|ok|okay|happy|glad|very|so|a|an|the|not|sorry|just|also|working|in|at|really|doing|going|new|sure|ready|interested|living|maxi's)$/i;
  G.VOZ_CONVOS = { NOT_NAME, SCENES, REPAIR, ACK, SORRY, FIXES, AI_TOPICS, AI_PERSONAS, aiSystem, handoffPrompt };
})(typeof window !== "undefined" ? window : globalThis);
