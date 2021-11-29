"use strict";

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

    getLinkImageSTIXObject(nameSTIXObject){
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
                "description": "Автономная система (Autonomous system DO STIX)",
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
                "description": "Доклад (Report DO STIX)",
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

        return listLink[nameSTIXObject];
    }
};

export { helpers };