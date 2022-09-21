"use strict";

const listLink = {
    "artifact": {
        "link": "Artifact-Square.png",
        "description": "Артефакт (Artifact СO STIX)",
    },				
    "directory": {
        "link": "Directory-Square.png",
        "description": "Каталог (Directory СO STIX)",
    },				
    "file": {
        "link": "File-Square.png",
        "description": "Файл (File СO STIX)",
    },					
    "mutex": {
        "link": "Mutex-Square.png",
        "description": "Мьютекс (Mutex СO STIX)",
    },				
    "process": {
        "link": "Process-Square.png",
        "description": "Процесс (Process СO STIX)",
    },			
    "software": {
        "link": "Software-Square.png",
        "description": "Программное обеспечение (Software СO STIX)",
    },				
    "url": {
        "link": "URL-Square.png",
        "description": "Унифицированный указатель ресурса (URL CO STIX)",
    },				
    "windows-registry-key": {
        "link": "WindowsRegistryKey-Square.png",
        "description": "Раздел реестра Windows (Windows registry key CO STIX)",
    },			
    "x509-certificate": {
        "link": "X509Certificate-Square.png",
        "description": "x509 сертификат (x509 certificate CO STIX)",
    },		
    "attack-pattern": {
        "link": "attack-pattern-square-dark-300-dpi.png",
        "description": "Шаблон атаки (Attack Pattern DO STIX)",
    },
    "autonomous-system": {
        "link": "autonomous-system-square-dark-300-dpi.png",
        "description": "Автономная система (Autonomous system CO STIX)",
    },
    "campaign": {
        "link": "campaign-square-dark-300-dpi.png",
        "description": "Кампания (Campaign DO STIX)",
    },		
    "course-of-action": {
        "link": "coa-square-dark-300-dpi.png",
        "description": "Реагирование (Course of Action DO STIX)",
    },	
    "domain-name": {
        "link": "domain-name-square-dark-300-dpi.png",
        "description": "Доменное имя (Domain name CO STIX)",
    },		
    "email-addr": {
        "link": "email-addr-square-dark-300-dpi.png",
        "description": "Email адрес (Email address CO STIX)",
    },	
    "email-message": {
        "link": "email-msg-square-dark-300-dpi.png",
        "description": "Email сообщение (Email message CO STIX)",
    },	
    "grouping": {
        "link": "grouping-square-dark-300-dpi.png",
        "description": "Группировка (Grouping DO STIX)",
    },	
    "identity": {
        "link": "identity-square-dark-300-dpi.png",
        "description": "Идентичность (Identity DO STIX)",
    },		
    "incident": {
        "link": "incident-square-dark-300-dpi.png",
        "description": "Инцидент (Incident DO STIX)",
    },	
    "indicator": {
        "link": "indicator-square-dark-300-dpi.png",
        "description": "Индикатор (Indicator DO STIX)",
    },		
    "infrastructure": {
        "link": "infrastructure-square-dark-300-dpi.png",	
        "description": "Инфраструктура (Infrastructure DO STIX)",
    },	
    "intrusion-set": {
        "link": "intrusion-set-square-dark-300-dpi.png",
        "description": "Набор вторжения (Intrusion Set DO STIX)",
    },
    "ipv4-addr": {
        "link": "ipv4-addr-square-dark-300-dpi.png",
        "description": "IP адрес версии 4 (IPv4 address CO STIX)",
    },
    "ipv6-addr": {
        "link": "ipv6-addr-square-dark-300-dpi.png",
        "description": "IP адрес версии 6 (IPv6 address CO STIX)",
    },
    "location": {
        "link": "location-square-dark-300-dpi.png",
        "description": "Местоположение (Location DO STIX)",
    },
    "mac-addr": {
        "link": "mac-addr-square-dark-300-dpi.png",
        "description": "MAC адрес (MAC address CO STIX)",
    },
    "malware": {
        "link": "malware-analysis-square-dark-300-dpi.png",
        "description": "Вредоносное программное обеспечение (Malware DO STIX)",
    },
    "malware-analysis": {
        "link": "malware-square-dark-300-dpi.png",
        "description": "Анализ вредоносного программного обеспечения (Malware analysis DO STIX)",
    },
    "network-traffic": {
        "link": "network-traffic-square-dark-300-dpi.png",
        "description": "Сетевой трафик (Network traffic CO STIX)",
    },
    "note": {
        "link": "note-square-dark-300-dpi.png",
        "description": "Примечание (Note DO STIX)",
    },
    "observed-data": {
        "link": "observed-data-square-dark-300-dpi.png",
        "description": "Наблюдение (Observed Data DO STIX)",
    },
    "opinion": {
        "link": "opinion-square-dark-300-dpi.png",
        "description": "Мнение (Opinion DO STIX)",
    },
    "relationship": {
        "link": "relationship-square-dark-300-dpi.png",
        "description": "Отношение (Relationship RO STIX)",
    },
    "report": {
        "link": "report-square-dark-300-dpi.png",
        "description": "Отчёт (Report DO STIX)",
    },
    "sighting": {
        "link": "sighting-square-dark-300-dpi.png",
        "description": "Визирование (Sighting RO STIX)",
    },
    "threat-actor": {
        "link": "threat-actor-square-dark-300-dpi.png",
        "description": "Исполнитель угроз (Threat actor DO STIX)",
    },
    "tool": {
        "link": "tool-square-dark-300-dpi.png",
        "description": "Инструмент (Tool DO STIX)",
    },
    "user-account": {
        "link": "user-account-square-dark-300-dpi.png",
        "description": "Учетная запись пользователя (User account CO STIX)",
    },
    "vulnerability": {
        "link": "vulnerability-square-dark-300-dpi.png",
        "description": "Уязвимость (Vulnerability DO STIX)",
    },
    //"": "bundle-square-dark-300-dpi.png",	
    //"": "http-square-dark-300-dpi.png",	
    //"": "language-square-dark-300-dpi.png",
    //"": "source-square-dark-300-dpi.png",
    //"": "tlp-amber-square-dark-300-dpi.png",
    //"": "victim-square-dark-300-dpi.png",
    //"": "victim-target-square-dark-300-dpi.png",
};

let listOnceProperties = [
    "src_ref", 
    "dst_ref",
    "image_ref",
    "sample_ref",
    "parent_ref",
    "host_vm_ref",
    "src_payload_ref", 
    "dst_payload_ref",
    "creator_user_ref",
    "encapsulated_by_ref", 
    "operating_system_ref",
    "message_body_data_ref",
];

let listManyProperties = [
    "child_refs",
    "object_refs",
    "sample_refs",
    "contains_refs",
    "resolves_to_refs",
    "encapsulates_refs", 
    "operating_system_refs", 
    "opened_connection_refs",
    "installed_software_refs",
];

let helpers = {
    //настраивает высоту отступа для элемента выводящего загрузку сетевых интерфейсов
    loadNetworkMarginTop() {
        let arrayLoadNetwork = document.getElementsByName("loadNetwork");
        if (arrayLoadNetwork.hasOwnProperty("length")) return;

        for (let key in arrayLoadNetwork) {
            let countElements = 0;
            for (let i in arrayLoadNetwork[key].children) {
                countElements++;
            }
            let num = (countElements - 4) / 3;
            let px = "0px";
            if (3 <= num && num <= 5) px = "35px";
            if (1 <= num && num <= 3) px = "40px";

            if (arrayLoadNetwork[key].nodeType === 1) {
                arrayLoadNetwork[key].style.marginTop = px;
            }
        }
    },

    //конвертирование даты и времени из формата Unix в стандартный формат
    getDate(dateUnix) {
        let x = (new Date()).getTimezoneOffset() * 60000;
        return (new Date((+dateUnix - x)).toISOString().slice(0, -1).replace(/T/, " ").replace(/\..+/, ""));
    },

    //возвращает строковое представление времени в формате ISO с учетом локального часового пояса
    getToISODatetime(){
        let dn = "";
        let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
        if(currentTimeZoneOffsetInHours < 0){
            dn = Date.now() + ((currentTimeZoneOffsetInHours * -1) * 3600000);
        } else if(currentTimeZoneOffsetInHours > 0) {
            dn = Date.now() - (currentTimeZoneOffsetInHours * 3600000);
        } else {
            dn = Date.now();
        }

        return new Date(dn).toISOString();
    },

    //конвертирование даты и времени из строки формата "2017-02-20T01:34:11Z" в объект Date
    convertDateFromString(dateString, { monthDescription = "numeric", dayDescription = "numeric" }){
        let x = -(new Date()).getTimezoneOffset() * 60000;

        return new Date(Date.parse(dateString) - x).toLocaleString("ru", {
            year: "numeric",
            //month: "numeric",
            month: monthDescription,
            //day: "numeric",
            day: dayDescription,
            timezone: "Europe/Moscow",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        });
    },

    //получить цвет значения
    getColor(number) {
        if (0 <= number && number <= 35) return "color: #83B4D7;";
        if (36 <= number && number <= 65) return "color: #9FD783;";
        if (66 <= number && number <= 85) return "color: #E1E691;";
        if (86 <= number) return "color: #C78888;";
    },

    //преобразование числа в строку с пробелами после каждой третьей цифры 
    intConvert(nLoad) {
        let newString = nLoad.toString();
        let interimArray = [];
        let countCycles = Math.ceil((newString.length / 3));
        let num = 0;
        for (let i = 1; i <= countCycles; i++) {
            interimArray.push(newString.charAt(newString.length - 3 - num) + newString.charAt(newString.length - 2 - num) + newString.charAt(newString.length - 1 - num));
            num += 3;
        }
        interimArray.reverse();
        return interimArray.join(" ");
    },

    //пересчет в Кбайты, Мбайты и Гбайты
    changeByteSize(byte) {
        if (byte < 1000) {
            return { size: byte, name: "байт" };
        } else if ((byte >= 1000) && (byte <= 1000000)) {
            return { size: (byte / 1000).toFixed(2), name: "Кбайт" };
        } else if ((byte >= 1000000) && (byte <= 1000000000)) {
            return { size: (byte / 1000000).toFixed(2), name: "Мбайт" };
        } else {
            return { size: (byte / 1000000000).toFixed(2), name: "Гбайт" };
        }
    },

    //конвертирование даты и вермени
    dateTimeConvert(dateUnixFormat) {
        let x = (new Date()).getTimezoneOffset() * 60000;
        return (new Date((+dateUnixFormat - x)).toISOString().slice(0, -1).replace(/T/, " ").replace(/\..+/, ""));
    },

    //получить не повторяющиеся элементы двух массивов
    getDifferenceArray(arrOne, arrTwo) {
        if (arrOne.length === 0) return arrTwo;
        if (arrTwo.length === 0) return arrOne;

        let result = [];
        if (arrOne.length === arrTwo.length) {
            for (let i = 0; i < arrOne.length; i++) {
                for (let j = 0; j < arrTwo.length; j++) {
                    if (arrOne[i] === arrTwo[j]) {
                        arrOne.splice(i, 1);
                        arrTwo.splice(j, 1);
                    }
                }
            }
            result = arrOne.concat(arrTwo.join(","));
        } else if (arrOne.length < arrTwo.length) {
            let stringOne = arrOne.join(" ");
            arrTwo.filter((item) => {
                return stringOne.indexOf(item.toString()) < 0;
            });
        } else {
            let stringOne = arrTwo.join(" ");
            arrOne.filter((item) => {
                return stringOne.indexOf(item.toString()) < 0;
            });
        }
        return result;
    },

    /**
     * проверка данных полученных от пользователя
     * 
     * @param {object} elem 
     */
    checkInputValidation(elem) {
        let objSettings = {
            "hostID": new RegExp("^[0-9]{2,}$"),
            "shortNameHost": new RegExp("^[a-zA-Z0-9_№\"\\-\\s]{3,}$"),
            "fullNameHost": new RegExp("^[a-zA-Zа-яА-ЯёЁ0-9_№()/\\'\"\\-\\s\\.,]{5,}$"),
            "ipaddress": new RegExp("^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)[.]){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$"),
            "port": new RegExp("^[0-9]{1,5}$"),
            "network": new RegExp("^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)[.]){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)/[0-9]{1,2}$"),
            "countProcess": new RegExp("^[0-9]{1}$"),
            "intervalTransmission": new RegExp("^[0-9]{1,}$"),
            "integer": new RegExp("^[0-9]{1,}$"),
            "folderStorage": new RegExp("^[\\w\\/_-]{3,}$"),
            "stringRuNumCharacter": new RegExp("^[а-яА-ЯёЁ0-9\\s.,№-]+$"),
            "stringAlphaRu": new RegExp("^[а-яА-ЯёЁ\\s]{4,}$"),
            "stringAlphaNumEng": new RegExp("^[a-zA-Z0-9_-]{4,}$"),
            "stringPasswd": new RegExp("^[a-zA-Z0-9!@#$%^&*()?]{7,}$"),
            "domanName": new RegExp("^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$")
        };
        let pattern = objSettings[elem.name];

        if (typeof pattern === "undefined") {
            return false;
        }

        if (elem.name === "port") {
            if (!(0 <= elem.value && elem.value < 65536)) return false;
        }
        if (elem.name === "intervalTransmission" && (elem.value < 10)) return false;
        return (!pattern.test(elem.value)) ? false : true;
    },

    //генератор токена
    tokenRand() {
        return (Math.random().toString(14).substr(2)) + (Math.random().toString(14).substr(2));
    },

    getListLinkImageSTIXObject(){
        return listLink;
    },

    getLinkImageSTIXObject(nameSTIXObject){
        return listLink[nameSTIXObject];
    },

    getListOnceProperties(){
        return listOnceProperties;
    },
    
    getListManyProperties(){
        return listManyProperties;
    },

    getHumanNameSTIXElement(value){
        const listValueName = {
            Abstract: "краткое изложение содержания записки",
            AccountCreated: "время создания аккаунта",
            AccountExpires: "время истечения срока действия учетной записи",
            AccountFirstLogin: "время первого доступа к учетной записи",
            AccountLastLogin: "время когда к учетной записи был последний доступ",
            AccountLogin: "логин пользователя",
            AccountType: "одно, из заранее определенных (предложенных) значений",
            AdditionalHeaderFields: "любые другие поля заголовка",
            AdministrativeArea: "административный округ",
            Aliases: "альтернативные имена",
            AnalysisDefinitionVersion: "версия определений анализа",
            AnalysisEnded: "время завершения анализа ВПО",
            AnalysisEngineVersion: "версия аналитического движка или продукта (включая AV-движки)",
            AnalysisScoRefs: "список идентификаторов на другие наблюдаемые DO STIX",
            AnalysisStarted: "время начала анализа ВПО",
            ArchitectureExecutionEnvs: "перечень архитектур в которых может быть выполнено ВПО",
            Atime: "время последнего обращения",
            Authors: "список авторов",
            AvResult: "результат аналитической обработки",
            BelongsToRef: "учетная запись пользователя, которой принадлежит адрес электронной почты",
            BelongsToRefs: "список ссылок на одну или несколько автономных систем (AS), к которым принадлежит IPv6-адрес",
            Body: "тело сообщения",
            CanEscalatePrivs: "индикатор, сигнализирующий что, учетная запись имеет возможность повышать привилегии",
            Capabilities: "перечень возможных id используемых для обнаружения ВПО",
            City: "наименование города",
            CommandLine: "полный перечень команд",
            Comment: "комментарий",
            ConfigurationVersion: "именованная конфигурация дополнительных параметров",
            ContactInformation: "любая контактная информация",
            ContainsRefs: "список ссылок или объектов",
            Content: "основное содержание",
            ContentRef: "контент файла",
            Context: "краткий дескриптор конкретного контекста",
            Country: "наименование страны",
            Created: "время создания",
            CreatedByRef: "id источника создавшего данный объект",
            CreatedTime: "время создания процесса",
            CreatorUserRef: "ссылка на объект пользователя",
            Credential: "учетные данные пользователя в открытом виде",
            CredentialLastChanged: "время когда учетные данные учетной записи были изменены в последний раз",
            Ctime: "время создания",
            Date: "дата",
            DecryptionKey: "ключ для дешифрования зашифрованных данных",
            Defanged: "определены ли данные содержащиеся в объекте",
            Description: "подробное описание",
            DisplayName: "имя отображающееся в пользовательских интерфейсах",
            DstByteCount: "число байтов отправленных из пункта назначения в источник",
            DstPackets: "количество пакетов отправленных от пункта назначения к источнику",
            DstPayloadRef: "байты, отправленные из пункта назначения в источник",
            DstPort: "порт назначения",
            DstRef: "ссылка назначения",
            EncapsulatedByRef: "ссылки на другой объект сетевого трафика, который инкапсулирует этот объект",
            EncapsulatesRefs: "ссылки на другие объекты, инкапсулированные этим объектом",
            EncryptionAlgorithm: "тип алгоритма шифрования",
            End: "окончание",
            EnvironmentVariables: "список переменных окружения",
            Explanation: "объяснение",
            Extensions: "список дополнительной информации",
            ExternalReferences: "внешние ссылки",
            FirstObserved: "время начала временного окна, в течение которого были замечены данные",
            FirstSeen: "время первого обнаружения",
            Goals: "высокоуровневые цели",
            GranularMarkings: "список \"гранулярных меток\"",
            HostVMRef: "id описание виртуального окружения",
            IdentityClass: "значение физического лица или организации",
            ImplementationLanguages: "перечень языков программирования, используемых для реализации ВПО",
            IndicatorTypes: "перечень категорий индикаторов",
            InfrastructureTypes: "перечень описываемых инфраструктур",
            InstalledSoftwareRefs: "список id ссылающихся на описание любого нестандартного ПО",
            IsActive: "продолжается ли сетевой трафик",
            IsDisabled: "значение отключено",
            IsFamily: "представляет ли объект семейство вредоносных программ",
            IsHidden: "определяет является ли процесс скрытым",
            IsMultipart: "содержит ли 'тело' email множественные MIME части",
            IsPrivileged: "индикатор, сигнализирующий что, учетная запись имеет повышенные привилегии",
            IsSelfSigned: "индикатор, является ли сертификат самоподписным",
            IsServiceAccount: "индикатор, сигнализирующий что, учетная запись связана с сетевой службой или системным процессом",
            Issuer: "название удостоверяющего центра выдавшего сертификат",
            Key: "ключ",
            KillChainPhases: "список цепочки фактов",
            Labels: "термины используемые для описания объекта",
            Lang: "текстовый код языка",
            LastObserved: "время окончание временного окна, в течение которого были замечены данные",
            LastSeen: "время последнего обнаружения",
            Latitude: "широта",
            Longitude: "долгота",
            MagicNumberHex: "шестнадцатеричная константа (“магическое число”)",
            MalwareTypes: "перечень вредоносного ПО",
            Modified: "время модификации",
            ModifiedTime: "время последнего изменения",
            Modules: "конкретные модули анализа",
            Mtime: "время модификации",
            Name: "название",
            NameEnc: "кодировку имени файла",
            Number: "номер",
            NumberObserved: "количество раз, фиксирования наблюдаемых кибер объектов CO STIX",
            NumberOfSubkeys: "количество подразделов",
            ObjectMarkingRefs: "список ID ссылающиеся на объект \"marking-definition\"",
            ObjectRefs: "ссылки на список объектов STIX",
            Objective: "основная цель",
            OpenedConnectionRefs: "список открытых, процессом, сетевых соединений",
            OperatingSystemRef: "id описание ОС",
            OperatingSystemRefs: "перечень идентификаторов ОС",
            Opinion: "мнение обо всех STIX объектах",
            OutsideSpecification: "свойства не входящие в основную спецификацию STIX 2.0",
            ParentDirectoryRef: "родительская директория для файла",
            Path: "путь",
            PathEnc: "наблюдаемая кодировка для пути",
            Pattern: "шаблон для обнаружения индикаторов",
            PatternType: "значение языкового шаблона",
            PatternVersion: "версия языка шаблонов",
            PayloadBin: "бинарные данные в base64",
            PersonalMotivations: "перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом",
            PostalCode: "почтовый адрес",
            Precision: "точность координат, заданных широтой и долготой",
            PrimaryMotivation: "причины, мотивации или цели",
            Product: "название аналитического ПО",
            Protocols: "сетевые протоколы",
            Published: "время публикацни",
            RIR: "название регионального Интернет-реестра (Regional Internet Registry)",
            Region: "перечень регионов",
            ReportTypes: "перечень возможных типов контента",
            ResolvesToRefs: "список ссылок",
            ResourceLevel: "набор или уровень",
            Result: "перечень результатов классификации, определяется аналитическим инструментом или сканером",
            ResultName: "результат классификации или имя ВПО",
            Revoked: "вернуть к текущему состоянию",
            Roles: "перечень возможных ролей",
            SampleRef: "ссылка на файл, сетевой трафик или объект",
            SampleRefs: "список id файлов ассоциируемых с ВПО",
            SecondaryMotivations: "вторичный перечень причин, мотиваций или целей",
            Sectors: "перечень отраслей промышленности",
            SerialNumber: "серийный номер",
            SignatureAlgorithm: "имя алгоритма, используемого для подписи сертификата",
            Size: "размер",
            Sophistication: "навыки или специальные знания",
            SpecVersion: "версия спецификации STIX",
            SrcByteCount: "число байтов отправленных от источника к месту назначения",
            SrcPackets: "количество пакетов отправленных от источника к месту назначения",
            SrcPayloadRef: "байты, отправленные из источника в пункт назначения",
            SrcPort: "исходный порт",
            SrcRef: "ссылка источник",
            Start: "начало",
            StreetAddress: "физический адрес",
            Subject: "имя сущности",
            SubjectPublicKeyAlgorithm: "название алгоритма применяемого для шифрования данных",
            SubjectPublicKeyExponent: "экспоненциальная часть открытого ключа RSA субъекта в виде целого числа",
            SubjectPublicKeyModulus: "модульная часть открытого ключа RSA",
            Submitted: "время отправления ВПО",
            ThreatActorTypes: "перечень типов субъектов угрозы",
            ToolTypes: "перечень типов инструментов",
            ToolVersion: "версия инструмента",
            ValidFrom: "время с которого этот индикатор считается валидным",
            ValidUntil: "время начиная с которого этот индикатор не может считаться валидным",
            ValidityNotAfter: "время окончания действия сертификата",
            ValidityNotBefore: "время начала действия сертификата",
            Values: "значение",
            Version: "версия",
            X509V3Extension: "стандартные расширения X.509 v3, которые могут использоваться в сертификате",
            Сonfidence: "уверенность создателя в правильности своих данных",
        };
    
        return ((typeof listValueName[value] === "undefined")? "": listValueName[value]); 
    }
};

export { helpers };