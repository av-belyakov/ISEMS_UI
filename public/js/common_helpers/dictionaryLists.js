export default {
    "identity-class-ov": {
        "id": "identity-class-ov",
        "name": "identity-class-ov",
        "summary": "Класс идентичности",
        "text": "Определяет типы сущьностей представляемых STIX-объектом Идентичность (Identity).",
        "content": [
            {
                "id": "individual",
                "name": "individual",
                "summary": "личность",
                "text": "Применяется в случае если Идентичность (Identity) представляет одного человека."
            },
            {
                "id": "group",
                "name": "group",
                "summary": "группа",
                "text": "Применяется в случае если Идентичность представляет неформальную группу лиц без централизованного  управления, например распределенная хакерская группа."
            },
            {
                "id": "system",
                "name": "system",
                "summary": "система",
                "text": "Применяется в случае если Идентичность представляет компьютерную систему (программно аппаратный комплекс, информационный ресурс и т.д.), например SIEM"
            },
            {
                "id": "organization",
                "name": "organization",
                "summary": "организация",
                "text": "Применяется в случае если Идентичность представляет формальную организацию с централизованным управлением, такую как компания или страна."
            },
            {
                "id": "class",
                "name": "class",
                "summary": "класс",
                "text": "Применяется в случае если Идентичность представляет какой то класс сущьностей, например все больницы, все министерства, все администраторы домена, все злоумышленники, все пользователи информационной системы, все европейцы, азиаты и т.д."
            },
            {
                "id": "unspecified",
                "name": "unspecified",
                "summary": "неуточненный",
                "text": "Применяется в случае если Идентичность неудается отнести к какому то из прочих типов"
            }
        ]
    },
    "industry-sector-ov": {
        "id": "industry-sector-ov",
        "name": "industry-sector-ov",
        "summary": "Промышленные сектора",
        "text": "Промышленный сектор - часть национальной экономики страны(региона) которая связана непосредственно с производством товаров без непосредственного использования больших объемов природных ресурсов. Значения применяться в объектах: Идентичность (Identity) (Перевод требует доработки)",
        "content": [
            {
                "id": "agriculture",
                "name": "agriculture",
                "summary": "сельское хозяйство",
                "text": "сектор сельского хозяйства"
            },
            {
                "id": "aerospace",
                "name": "aerospace",
                "summary": "аэрокосмический",
                "text": "сектор аэрокосмической промышленности "
            },
            {
                "id": "automotive",
                "name": "automotive",
                "summary": "автомобилестроение",
                "text": "сектор автомобилестроения"
            },
            {
                "id": "chemical",
                "name": "chemical",
                "summary": "химическая промышленность",
                "text": "сектор химической промышленности"
            },
            {
                "id": "commercial",
                "name": "commercial",
                "summary": "коммерческий",
                "text": "сектор торговли и предпринимательства"
            },
            {
                "id": "communications",
                "name": "communications",
                "summary": "связь и коммуникации",
                "text": "связь и коммуникации"
            },
            {
                "id": "construction",
                "name": "construction",
                "summary": "строительство",
                "text": "сектор строилества"
            },
            {
                "id": "defense",
                "name": "defense",
                "summary": "обороная промышленность",
                "text": "сектор обороной промышленности"
            },
            {
                "id": "education",
                "name": "education",
                "summary": "образование",
                "text": "образование"
            },
            {
                "id": "energy",
                "name": "energy",
                "summary": "энергетика",
                "text": "сектор энергетики"
            },
            {
                "id": "entertainment",
                "name": "entertainment",
                "summary": "отдых и развлечение",
                "text": "сектор индустрии отдыха и развлечений"
            },
            {
                "id": "financial-services",
                "name": "financial-services",
                "summary": "финансовые услуги",
                "text": "сектор финансовых услуг - отрасль экономики, включающая в себя учреждения, оказывающие разнообразные финансовые услуги"
            },
            {
                "id": "government",
                "name": "government",
                "summary": "правительство",
                "text": ""
            },
            {
                "id": "emergency-services",
                "name": "emergency-services",
                "summary": "экстренные службы",
                "text": "экстренные службы, например спасательная служба, служба скорой помощи, полиция и т.д."
            },
            {
                "id": "government-local",
                "name": "government-local",
                "summary": "местное правительство",
                "text": "местное правительство полагаю такое как муниципальная власть"
            },
            {
                "id": "government-national",
                "name": "government-national",
                "summary": "национальное правительство",
                "text": "национальное правительство"
            },
            {
                "id": "government-public-services",
                "name": "government-public-services",
                "summary": "государственные службы",
                "text": "государственные службы"
            },
            {
                "id": "government-regional",
                "name": "government-regional",
                "summary": "региональное правительство",
                "text": "региональное правительство"
            },
            {
                "id": "healthcare",
                "name": "healthcare",
                "summary": "здравоохранение",
                "text": "здравоохранение"
            },
            {
                "id": "hospitality-leisure",
                "name": "hospitality-leisure",
                "summary": "досуг и гостеприимство",
                "text": "досуг и гостеприимство"
            },
            {
                "id": "infrastructure",
                "name": "infrastructure",
                "summary": "инфраструктура",
                "text": ""
            },
            {
                "id": "dams",
                "name": "dams",
                "summary": "плотины",
                "text": "плотины"
            },
            {
                "id": "nuclear",
                "name": "nuclear",
                "summary": "атомная промышленность",
                "text": "сектор атомной промышленности - совокупность предприятий и организаций, связанных организационно и технологически, которые производят продукцию, работы и услуги, применение которых основано на использовании ядерных технологий и достижений ядерной физики. В структуре атомной промышленности можно выделить несколько крупных научно-производственных комплексов : Ядерный энергетический комплекс: предприятия по добыче и обогащению урана, предприятия по производству ядерного топлива, предприятия атомной энергетики (проектирование, инжиниринг, строительство и эксплуатация атомных электростанций), ядерное и энергетическое машиностроение, ядерный-оружейный комплекс, ядерная и радиационная безопасность, атомный ледокольный флот, ядерная медицина, научно-исследовательские институты (прикладная и фундаментальная наука)"
            },
            {
                "id": "water",
                "name": "water",
                "summary": "водное хозяйство",
                "text": "водное хозяйство обеспечивает питьевую воду и сточные воды услуги (включая очистку сточных вод ) в жилые, коммерческие и промышленные сектора экономики . Обычно коммунальные предприятия обслуживают сети водоснабжения . В водную отрасль не входят производители и поставщики бутилированной воды , которая является частью производства напитков и относится к пищевому сектору."
            },
            {
                "id": "insurance",
                "name": "insurance",
                "summary": "страхование",
                "text": ""
            },
            {
                "id": "manufacturing",
                "name": "manufacturing",
                "summary": "обрабатывающая промышленность",
                "text": "обрабатывающая промышленность"
            },
            {
                "id": "mining",
                "name": "mining",
                "summary": "горнодобывающая промышленность",
                "text": "горнодобывающая промышленность"
            },
            {
                "id": "non-profit",
                "name": "non-profit",
                "summary": "некоммерческие организации",
                "text": ""
            },
            {
                "id": "pharmaceuticals",
                "name": "pharmaceuticals",
                "summary": "фармацевтическая промышленность",
                "text": "Фармацевтическая промышленность-отрасль промышленности, связанная с исследованием, разработкой, массовым производством, изучением рынка и распределением лекарственных средств, преимущественно предназначенных для профилактики, облегчения и лечения болезней."
            },
            {
                "id": "retail",
                "name": "retail",
                "summary": "розничная торговля",
                "text": "сектор розничной торговли -  продажа товаров и услуг, предназначенных для личного или семейного использования (т.е. не связанного с предпринимательской деятельностью), непосредственно конечному потребителю."
            },
            {
                "id": "technology",
                "name": "technology",
                "summary": "технологический сектор",
                "text": "технологический сектор - это категория запасов, относящихся к исследованиям, разработке и / или распределению товаров и услуг, основанных на технологиях. Этот сектор включает в себя предприятия, вращающиеся вокруг производства электроники, создания программного обеспечения, компьютеров или продуктов и услуг, связанных с информационными технологиями."
            },
            {
                "id": "telecommunications",
                "name": "telecommunications",
                "summary": "связь и телекоммуникаций",
                "text": "сектор телекоммуникаций"
            },
            {
                "id": "transportation",
                "name": "transportation",
                "summary": "перевозки",
                "text": ""
            },
            {
                "id": "utilittye",
                "name": "utilittye",
                "summary": "коммунальные услуги",
                "text": ""
            }
        ]
    },
    "infrastructure-type-ov": {
        "id": "infrastructure-type-ov",
        "name": "infrastructure-type-ov",
        "summary": "Значения применяться в объектах: Инфраструктура (Infrastructure)",
        "text": "Содержит перечисление типов инфраструктуры",
        "content": [
            {
                "id": "amplification",
                "name": "amplification",
                "summary": "усиление",
                "text": "Определяет инфраструктуру, используемую для проведения атак типа amplification (усиление)."
            },
            {
                "id": "anonymization",
                "name": "anonymization",
                "summary": "анонимизация",
                "text": "Определяет инфраструктуру, используемую для анонимизации, например прокси-сервер."
            },
            {
                "id": "botnet",
                "name": "botnet",
                "summary": "ботнет",
                "text": "Определяет членство/состав ботнета в терминах сетевых адресов хостов, составляющих ботнет."
            },
            {
                "id": "command-and-control",
                "name": "command-and-control",
                "summary": "управление и контроль",
                "text": "Определяет инфраструктуру, используемую для управления и контроля (C2). Обычно это доменные имена или IP-адрес."
            },
            {
                "id": "exfiltration",
                "name": "exfiltration",
                "summary": "утечка (эксфильтрация)",
                "text": "Указывает инфраструктуру, используемую в качестве конечной точки для эксфильтрации данных."
            },
            {
                "id": "hosting-malware",
                "name": "hosting-malware",
                "summary": "размещение вредоносного ПО",
                "text": "Определяет инфраструктуру используемую для хостинга ВПО"
            },
            {
                "id": "hosting-target-lists",
                "name": "hosting-target-lists",
                "summary": "публикация списка целей",
                "text": "Определяет инфраструктуру, используемую для публикации (размещения) списка целей для DDOS-атак, фишинга и других вредоносных действий. Обычно это доменное имя или ip-адрес."
            },
            {
                "id": "phishing",
                "name": "phishing",
                "summary": "фишинг",
                "text": "Определяет инфраструктуру, используемую для проведения фишинговых атак."
            },
            {
                "id": "reconnaissance",
                "name": "reconnaissance",
                "summary": "разведка",
                "text": "Определяет инфраструктуру, используемую для проведения разведывательных мероприятий."
            },
            {
                "id": "staging",
                "name": "staging",
                "summary": "промежуточно",
                "text": "Указывает инфраструктуру, используемую для промежуточного размещения."
            },
            {
                "id": "unknown",
                "name": "unknown",
                "summary": "неизвесный",
                "text": "Указывает инфраструктуру какого-либо неизвестного типа."
            }
        ]
    },
    "attack-resource-level-ov": {
        "id": "attack-resource-level-ov",
        "name": "attack-resource-level-ov",
        "summary": "Уровень ресурсов атаки",
        "text": "Содержит уровни относимости ресурсов доступ к которым вероятно может быть получен Субъектом атаки, Набором вторжения или Кампанией. Уровни перечисляют перечень категорий от одельного физического лица действующего в одиночку, до государства и его национальных ресурсов",
        "content": [
            {
                "id": "individual",
                "name": "individual",
                "summary": "индивидуальный",
                "text": "К данному уровню можно отнести реурсы доступ к которым может получить среднестатистический индивидуум который как правило действует независимо сам по себе."
            },
            {
                "id": "club",
                "name": "club",
                "summary": "клуб",
                "text": "К данному уровню можно отнести ресурсы используются группой участников взаимодействующих на социальной и добровольной основе, часто без особого личного интереса к конкретной цели. Например группа не связанных между собой активистов, регулярно обменивается советами в определенном блоге. Данная группа сохраняется в течение длительного времени."
            },
            {
                "id": "contest",
                "name": "contest",
                "summary": "соревнование, конкурс, турнир",
                "text": "К данному уровню можно отнести ресурсы используемые для непродолжительного и, возможно, анонимного взаимодействия, которое завершается, когда участники группы достигли единой цели. Например проведения конкурса по взлому какой либо системы ради острых ощущений или престижа. Очень часто данное может быть назначен приз за выигрыш в данном мероприятии."
            },
            {
                "id": "team",
                "name": "team",
                "summary": "команда",
                "text": "К данному уровню можно отнести ресурсы которые могут быть использованы формально организованой группой имеющей лидера. Группа обычно мотивированна определенной целью и организованная вокруг этой цели, существует в течение длительного времени и, как правило, действует в рамках одного конкретного географического места."
            },
            {
                "id": "organization",
                "name": "organization",
                "summary": "организация",
                "text": "К данному уровню можно отнести ресурсы которые могут быть использованы какойто организацией. В отличие от команды организация крупнее и лучше обеспечена ресурсами, как правило является компанией или преступным синдикатом. Обычно действует на территории нескольуих георафических областей и существует продолжительное время."
            },
            {
                "id": "government",
                "name": "government",
                "summary": "правительство",
                "text": "К данному уровню можно отнести ресурсы которые используются в пределах своей юрисдикции каким либо государством для осуществления своих полномочий. Сохраняются в догосрочной перспективе."
            }
        ]
    },
    "attack-motivation-ov": {
        "id": "attack-motivation-ov",
        "name": "attack-motivation-ov",
        "summary": "Мотивация атаки",
        "text": "Открытый словарь используется в следующих STIX-объектах: Intrusion Set (Набор вторжения) и Threat Actor (Субъект угрозы). Используется с целью лучшего понимания поведения и вероятных целей",
        "content": [
            {
                "id": "accidental",
                "name": "accidental",
                "summary": "случайный",
                "text": "Характерна для не враждебных субъектов который не преднамеренно своими действиями причиняют или могут причинить вред"
            },
            {
                "id": "coercion",
                "name": "coercion",
                "summary": "принуждение",
                "text": "Характеризует субъект вынужденный выполнять незаконные действия в интересах другого лица либо действовать от чьего - то имени. Действует не ради выгоды а из страха."
            },
            {
                "id": "dominance",
                "name": "dominance",
                "summary": "господство",
                "text": "Характеризует субъект желающий утвердить свое превосходство над кем-то или чем-то. Действия субъекта сосредоточены на использовании своей власти, направленны на подчинение цели или ее нейтрализации. Может сочетаться с идеологией для атак спонсируемых государством или с известностью для атак основаных на кибервандализме."
            },
            {
                "id": "ideology",
                "name": "ideology",
                "summary": "идеология",
                "text": "Характеризует субъект злонамеренный и незаконные действия которого обусловенны совокупностью идей, убеждений и ценностей. Характеризует противников, которые действуют по идеологическим соображениям (например, политическим, религиозным, правам человека, экологическим, желанию вызвать хаос и т.д.). Могут действовать из собственного чувства морали, справедливости или политической лояльности. Обычно не мотивированы в первую очередь стремлением к прибыли"
            },
            {
                "id": "notoriety",
                "name": "notoriety",
                "summary": "дурная слава",
                "text": "Характеризует субъект стремящийся к престижу или известности благодаря незаконной деятельности. Очень часто субъекты стремятся к личному признанию, либо к уважению в сообщества. Одна из главных целей-завоевать уважение целевой аудитории."
            },
            {
                "id": "organizational-gain",
                "name": "organizational-gain",
                "summary": "выгода организации",
                "text": "Характеризует субъект стремящийся получить конкурентное преимущество перед различными в том числе и военными организациями. Субъект мотивированн увеличением прибыли или другими выгодами за счет незаконно полученного конкурентного преимущества, завоевания сегмента рынка и улучшения иных возможностей. Часто стремится к хищению комерческой, прочей тайн, хищению интеллектуальной собственности, бизнес-процессов,соглашений о цепочках поставок и т.д."
            },
            {
                "id": "personal-gain",
                "name": "personal-gain",
                "summary": "личная выгода",
                "text": "Характеризует субъект движимые эгоистичным стремлением к личной выгоде и желающий улучшить собственное финансовое положение. Субъект часто стремятся получить выгоду от таких злонамеренных действий как финансовое мошенничество, взлом по найму, кража интеллектуальной собственности. Часто такие субъекты объединяются в сообщества для того, чтобы максимизировать свою личную прибыль."
            },
            {
                "id": "personal-satisfaction",
                "name": "personal-satisfaction",
                "summary": "личное удовлетворение",
                "text": "Характеризует желание удовлетворить личные эмоциональной потребности, включая любопытство, стремление к острым ощущениям, развлечениям и т.д. Какая-то другая выгода от соверщаемых действий (например прибыль) является случайной и не является основной мотивацией. Данный мотив может спонтанно (заранее не организованно) объединять отдельных людей для достижения общей цели"
            },
            {
                "id": "revenge",
                "name": "revenge",
                "summary": "месть",
                "text": "Характеризует мотивацию субъекта как желание отомстить за предполагаемые обиды совершая злонаимеренные действия такие как саботаж, насилие, кража, мошенничество, унижение физических лиц или организации. Субъект может являться как отдельным лицом так и группой единомышленников считающих что их объединение поможет им действовать более эфективно и причинить больше вреда. Субъект может включать бывших сотрудников организации  которые могут обладать обширными знаниями о ней, которые можно использовать при проведении атак."
            },
            {
                "id": "unpredictable",
                "name": "unpredictable",
                "summary": "непредсказуемый",
                "text": "Характеризует субъет действующий непредсказуемо без определенной цели либо причины. Действия субъекта случайны, причудливы, аномальны, не имеют логической цели."
            }
        ]
    },
    "region-ov": {
        "id": "region-ov",
        "name": "region-ov",
        "summary": "Регион",
        "text": "Открытый словарь используется в следующих STIX-объектах: Location (Местоположение). Список регионов мира, основанный на геосхеме Организации Объединенных Наций",
        "content": [
            {
                "id": "africa",
                "name": "africa",
                "summary": "Африка",
                "content": [
                    {
                        "id": "eastern-africa",
                        "name": "eastern-africa",
                        "summary": "восточная Африка",
                        "text": ""
                    },
                    {
                        "id": "middle-africa",
                        "name": "middle-africa",
                        "summary": "ближний восток Африка",
                        "text": ""
                    },
                    {
                        "id": "northern-africa",
                        "name": "northern-africa",
                        "summary": "северная Африка",
                        "text": ""
                    },
                    {
                        "id": "southern-africa",
                        "name": "southern-africa",
                        "summary": "юг Африки",
                        "text": ""
                    },
                    {
                        "id": "western-africa",
                        "name": "western-africa",
                        "summary": "западная Африка",
                        "text": ""
                    },
                ],
            },
            { 
                "id": "americas",
                "name": "americas",
                "summary": "Америка",
                "content": [
                    {
                        "id": "caribbean",
                        "name": "caribbean",
                        "summary": "Карибы",
                        "text": ""
                    },
                    {
                        "id": "central-america",
                        "name": "central-america",
                        "summary": "центральная Америка",
                        "text": ""
                    },
                    {
                        "id": "latin-america-caribbean",
                        "name": "latin-america-caribbean",
                        "summary": "латинская Америка Карибский бассейн",
                        "text": ""
                    },
                    {
                        "id": "northern-america",
                        "name": "northern-america",
                        "summary": "северная Америка",
                        "text": ""
                    },
                    {
                        "id": "south-america",
                        "name": "south-america",
                        "summary": "южная Америка",
                        "text": ""
                    },                
                ],
            },
            { 
                "id": "asia",
                "name": "asia",
                "summary": "Азия",
                "content": [
                    {
                        "id": "central-asia",
                        "name": "central-asia",
                        "summary": "центральная Азия",
                        "text": ""
                    },
                    {
                        "id": "eastern-asia",
                        "name": "eastern-asia",
                        "summary": "восточная Азия",
                        "text": ""
                    },
                    {
                        "id": "southern-asia",
                        "name": "southern-asia",
                        "summary": "южная Азия",
                        "text": ""
                    },
                    {
                        "id": "south-eastern-asia",
                        "name": "south-eastern-asia",
                        "summary": "юго-восточная Азия",
                        "text": ""
                    },
                    {
                        "id": "western-asia",
                        "name": "western-asia",
                        "summary": "западная Азия",
                        "text": ""
                    },
                ],
            },
            { 
                "id": "europe",
                "name": "europe",
                "summary": "Европа",
                "content": [
                    {
                        "id": "eastern-europe",
                        "name": "eastern-europe",
                        "summary": "восточная Европа",
                        "text": ""
                    },
                    {
                        "id": "northern-europe",
                        "name": "northern-europe",
                        "summary": "северная Европа",
                        "text": ""
                    },
                    {
                        "id": "southern-europe",
                        "name": "southern-europe",
                        "summary": "южная Европа",
                        "text": ""
                    },
                    {
                        "id": "western-europe",
                        "name": "western-europe",
                        "summary": "западная Европа",
                        "text": ""
                    },
                ],
            },
            { 
                "id": "oceania",
                "name": "oceania",
                "summary": "Океания",
                "content": [
                    {
                        "id": "antarctica",
                        "name": "antarctica",
                        "summary": "Антарктида",
                        "text": ""
                    },
                    {
                        "id": "australia-new-zealand",
                        "name": "australia-new-zealand",
                        "summary": "Австралия-новая-Зеландия",
                        "text": ""
                    },
                    {
                        "id": "melanesia",
                        "name": "melanesia",
                        "summary": "Меланезия",
                        "text": ""
                    },
                    {
                        "id": "micronesia",
                        "name": "micronesia",
                        "summary": "Микронезия",
                        "text": ""
                    },
                    {
                        "id": "polynesia",
                        "name": "polynesia",
                        "summary": "Полинезия",
                        "text": ""
                    },
                ],
            },                
        ]
    },
    "grouping-context-ov": {
        "id": "grouping-context-ov",
        "name": "grouping-context-ov",
        "summary": "Контекст группировки",
        "text": "Контекст группировки в настоящее время используется только в объекте Группировка (Grouping)",
        "content": [
            {
                "id": "suspicious-activity",
                "name": "suspicious-activity",
                "summary": "подозрительная активность",
                "text": "Помечает набор STIX-объектов которые можно отнести к конкретному событию содержащему подозрительную активность"
            },
            {
                "id": "malware-analysis",
                "name": "malware-analysis",
                "summary": "анализ вредоносных программ",
                "text": "Помечает набор STIX-объектов которые можно соотнести с конкретным экземпляром ВПО или отнести к конкретному семейству ВПО."
            },
            {
                "id": "unspecified",
                "name": "unspecified",
                "summary": "неуточненный",
                "text": "Помечает множество STIX-объектов контекстно связанных, но без какой-либо точной характеристики контекста связующего объекты"
            }
        ]
    }
};