import { Round } from './types'

export const ROUNDS: Round[] = [
  {
    title: 'WINTER OLYMPIC HISTORY',
    questions: [
      {
        question: 'In which year were the first Winter Olympic Games held?',
        answer: '1924',
        wrongAnswers: ['1920', '1928', '1932'],
      },
      {
        question: 'Which city hosted the inaugural Winter Olympics in 1924?',
        answer: 'Chamonix',
        wrongAnswers: ['Innsbruck', 'Oslo', 'St. Moritz'],
      },
      {
        question: 'How many sports were featured at the first Winter Olympics?',
        answer: '9',
        wrongAnswers: ['6', '12', '15'],
      },
      {
        question: 'Which country has won the most Winter Olympic gold medals of all time?',
        answer: 'Norway',
        wrongAnswers: ['United States', 'Germany', 'Canada'],
      },
      {
        question: 'In what year did the Winter and Summer Olympics split into separate four-year cycles?',
        answer: '1994',
        wrongAnswers: ['1992', '1996', '1998'],
      },
      {
        question: 'Which city hosted the Winter Olympics twice, in 1932 and 1980?',
        answer: 'Lake Placid',
        wrongAnswers: ['Innsbruck', 'Calgary', 'Squaw Valley'],
      },
      {
        question: 'Who lit the cauldron at the 1994 Lillehammer Winter Olympics opening ceremony?',
        answer: 'Crown Prince Haakon',
        wrongAnswers: ['King Harald V', 'Bjørn Dæhlie', 'Vegard Ulvang'],
      },
      {
        question: 'Which country hosted the 2022 Winter Olympics?',
        answer: 'China',
        wrongAnswers: ['Japan', 'South Korea', 'Canada'],
      },
      {
        question: 'How many rings are on the Olympic flag?',
        answer: '5',
        wrongAnswers: ['3', '4', '6'],
      },
      {
        question: 'Which Winter Olympics was the first to allow professional athletes?',
        answer: 'Calgary 1988',
        wrongAnswers: ['Sarajevo 1984', 'Albertville 1992', 'Lillehammer 1994'],
      },
    ],
  },
  {
    title: 'ALPINE & SNOW SPORTS',
    questions: [
      {
        question: 'How many disciplines are contested in Alpine skiing at the Olympics?',
        answer: '5',
        wrongAnswers: ['3', '4', '6'],
      },
      {
        question: 'What is the maximum number of ski runs allowed in Olympic slalom?',
        answer: '2',
        wrongAnswers: ['1', '3', '4'],
      },
      {
        question: 'Which country pioneered biathlon as an Olympic discipline?',
        answer: 'Norway',
        wrongAnswers: ['Sweden', 'Finland', 'Switzerland'],
      },
      {
        question: 'In ski jumping, what is the in-run position also known as?',
        answer: 'Aerodynamic tuck',
        wrongAnswers: ['K-point stance', 'Telemark crouch', 'Jump gate stance'],
      },
      {
        question: 'How many shooting targets must a biathlete hit in each range stop?',
        answer: '5',
        wrongAnswers: ['3', '4', '10'],
      },
      {
        question: 'What material are modern Olympic cross-country ski poles typically made from?',
        answer: 'Carbon fibre',
        wrongAnswers: ['Aluminium', 'Titanium', 'Fibreglass'],
      },
      {
        question: 'In freestyle skiing aerials, what determines the score multiplier?',
        answer: 'Degree of difficulty',
        wrongAnswers: ['Air time bonus', 'Height coefficient', 'Rotation multiplier'],
      },
      {
        question: "How long is the women's Olympic biathlon pursuit race?",
        answer: '10 km',
        wrongAnswers: ['7.5 km', '12.5 km', '15 km'],
      },
      {
        question: 'What is the minimum vertical drop for an Olympic downhill course?',
        answer: '800 metres',
        wrongAnswers: ['450 metres', '600 metres', '1000 metres'],
      },
      {
        question: 'Which ski event combines downhill and slalom disciplines?',
        answer: 'Alpine Combined',
        wrongAnswers: ['Super-G', 'Giant Slalom', 'Parallel Slalom'],
      },
    ],
  },
  {
    title: 'ICE SPORTS & SKATING',
    questions: [
      {
        question: 'How many players are on the ice per team in Olympic ice hockey?',
        answer: '6',
        wrongAnswers: ['5', '7', '8'],
      },
      {
        question: 'What is the name of a quadruple-rotation jump in figure skating?',
        answer: 'Quadruple jump (quad)',
        wrongAnswers: ['Triple Axel', 'Quintuple loop', 'Grand Jeté'],
      },
      {
        question: 'How long is an Olympic speed skating long track?',
        answer: '400 metres',
        wrongAnswers: ['200 metres', '333 metres', '500 metres'],
      },
      {
        question: 'What is the weight of the stone used in Olympic curling?',
        answer: '19.96 kg (44 lbs)',
        wrongAnswers: ['15.2 kg (33.5 lbs)', '22.7 kg (50 lbs)', '17.5 kg (38.6 lbs)'],
      },
      {
        question: 'In short track speed skating, what is the most popular Olympic relay distance?',
        answer: '5000 m relay',
        wrongAnswers: ['500 m relay', '1500 m relay', '3000 m relay'],
      },
      {
        question: 'How many ends are played in an Olympic curling match?',
        answer: '10',
        wrongAnswers: ['6', '8', '12'],
      },
      {
        question: 'Which element is mandatory in the Olympic figure skating free skate for pairs?',
        answer: 'Throw jump',
        wrongAnswers: ['Death spiral', 'Parallel spin', 'Solo combination jump'],
      },
      {
        question: "In speed skating, what distinguishes the 'mass start' event?",
        answer: 'All skaters start together',
        wrongAnswers: ['A standing start from blocks', 'A staggered lane start', 'A rolling start from the back straight'],
      },
      {
        question: 'What temperature is Olympic ice hockey ice typically kept at?',
        answer: '-5 to -9°C',
        wrongAnswers: ['-1 to -3°C', '-12 to -15°C', '0 to -2°C'],
      },
      {
        question: 'How many sheets of ice are used simultaneously in Olympic curling competition?',
        answer: '4',
        wrongAnswers: ['2', '6', '8'],
      },
    ],
  },
  {
    title: 'BOBSLED, LUGE & SKELETON',
    questions: [
      {
        question: 'In which direction does a skeleton athlete travel down the track?',
        answer: 'Head first, face down',
        wrongAnswers: ['Feet first, face up', 'Head first, face up', 'Feet first, face down'],
      },
      {
        question: 'How many crew members are in an Olympic four-man bobsled?',
        answer: '4',
        wrongAnswers: ['2', '3', '5'],
      },
      {
        question: 'What is the top speed typically reached in Olympic luge?',
        answer: 'Over 140 km/h',
        wrongAnswers: ['Over 100 km/h', 'Over 120 km/h', 'Over 160 km/h'],
      },
      {
        question: 'Which sliding sport was most recently added to the Winter Olympics?',
        answer: 'Skeleton (2002)',
        wrongAnswers: ['Luge (1964)', 'Two-man bobsled (1932)', 'Four-man bobsled (1924)'],
      },
      {
        question: 'In luge, athletes steer primarily using which body parts?',
        answer: 'Calves and shoulders',
        wrongAnswers: ['Knees and hips', 'Arms and elbows', 'Feet and neck'],
      },
      {
        question: 'What is the name of the starting area in Olympic bobsled?',
        answer: 'Start house',
        wrongAnswers: ['Launch pad', 'Push block', 'Starting gate'],
      },
      {
        question: 'How many runs do Olympic luge athletes complete in competition?',
        answer: '4',
        wrongAnswers: ['2', '3', '6'],
      },
      {
        question: 'Which country dominated bobsled at the Winter Olympics for most of the 20th century?',
        answer: 'Switzerland',
        wrongAnswers: ['United States', 'Germany', 'Austria'],
      },
      {
        question: 'What materials are modern competition luge sleds primarily made from?',
        answer: 'Fibreglass and carbon fibre',
        wrongAnswers: ['Steel and aluminium', 'Titanium and Kevlar', 'Wood and fibreglass'],
      },
      {
        question: 'In Olympic bobsled, how precise is the timing for each run?',
        answer: 'To the thousandth of a second',
        wrongAnswers: ['To the hundredth of a second', 'To the tenth of a second', 'To the nearest second'],
      },
    ],
  },
  {
    title: 'MILAN–CORTINA 2026',
    questions: [
      {
        question: 'Which two Italian cities co-host the 2026 Winter Olympics?',
        answer: "Milan and Cortina d'Ampezzo",
        wrongAnswers: ['Venice and Turin', 'Rome and Bolzano', 'Florence and Trento'],
      },
      {
        question: 'In which year was the 2026 Winter Olympics host city selected?',
        answer: '2019',
        wrongAnswers: ['2017', '2018', '2021'],
      },
      {
        question: 'What is the official motto of the Milan–Cortina 2026 Winter Olympics?',
        answer: 'Dreams Are Forever',
        wrongAnswers: ['Together We Shine', 'Passion Lives Here', 'Beyond the Horizon'],
      },
      {
        question: 'How many sports are on the programme for Milan–Cortina 2026?',
        answer: '16',
        wrongAnswers: ['12', '14', '18'],
      },
      {
        question: 'Which sport makes its Olympic Winter Games debut at Milan–Cortina 2026?',
        answer: 'Ski mountaineering',
        wrongAnswers: ['Ice climbing', 'Speed skiing', 'Snow volleyball'],
      },
      {
        question: 'Which arena will host ice hockey at Milan–Cortina 2026?',
        answer: 'Mediolanum Forum',
        wrongAnswers: ['San Siro Arena', 'Palazzo del Ghiaccio', 'PalaOlimpico'],
      },
      {
        question: 'What is the name of the Milan–Cortina 2026 official mascot?',
        answer: 'Tina',
        wrongAnswers: ['Neve', 'Stella', 'Ghiaccio'],
      },
      {
        question: 'In what month does the Milan–Cortina 2026 Olympics begin?',
        answer: 'February',
        wrongAnswers: ['January', 'March', 'December'],
      },
      {
        question: "What is the name of Milan's famous historic canal network?",
        answer: 'The Navigli',
        wrongAnswers: ['The Tiber', 'The Arno', 'The Brenta'],
      },
      {
        question: 'How many athletes are expected to compete at Milan–Cortina 2026?',
        answer: 'Approximately 2,900',
        wrongAnswers: ['Approximately 1,500', 'Approximately 2,200', 'Approximately 3,800'],
      },
    ],
  },
]
