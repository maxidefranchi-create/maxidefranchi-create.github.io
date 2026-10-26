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
