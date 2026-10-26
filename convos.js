/* Charlas guiadas: situaciones con personajes, respuestas esperadas y correcciones típicas de hispanohablantes. */
(function (G) {
  "use strict";
  const NUM = "(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|a hundred|hundred)";
  const R = (s) => new RegExp(s.replace(/NUM/g, NUM), "i");
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
