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
                "description": "Artifact СO STIX - Артефакт",
            },				
            "directory": {
                "link": "Directory-Square.png",
                "description": "Directory СO STIX - Каталог",
            },				
            "file": {
                "link": "File-Square.png",
                "description": "File СO STIX - Файл",
            },					
            "mutex": {
                "link": "Mutex-Square.png",
                "description": "Mutex СO STIX - Мьютекс",
            },				
            "process": {
                "link": "Process-Square.png",
                "description": "Process СO STIX - Процесс",
            },			
            "software": {
                "link": "Software-Square.png",
                "description": "Software СO STIX - Программное обеспечение",
            },				
            "url": {
                "link": "URL-Square.png",
                "description": "URL CO STIX - Унифицированный указатель ресурса",
            },				
            "windows-registry-key": {
                "link": "WindowsRegistryKey-Square.png",
                "description": "Windows registry key CO STIX - Раздел реестра Windows",
            },			
            "x509-certificate": {
                "link": "X509Certificate-Square.png",
                "description": "x509 certificate CO STIX - x509 сертификат",
            },		
            "attack-pattern": {
                "link": "attack-pattern-square-dark-300-dpi.png",
                "description": "Attack Pattern DO STIX - Шаблон атаки",
            },
            "autonomous-system": {
                "link": "autonomous-system-square-dark-300-dpi.png",
                "description": "Autonomous system DO STIX - Автономная система",
            },
            "campaign": {
                "link": "campaign-square-dark-300-dpi.png",
                "description": "Campaign DO STIX - Кампания",
            },		
            "course-of-action": {
                "link": "coa-square-dark-300-dpi.png",
                "description": "Course of Action DO STIX - Реагирование",
            },	
            "domain-name": {
                "link": "domain-name-square-dark-300-dpi.png",
                "description": "Domain name CO STIX - Доменное имя",
            },		
            "email-addr": {
                "link": "email-addr-square-dark-300-dpi.png",
                "description": "Email address CO STIX - Email адрес",
            },	
            "email-message": {
                "link": "email-msg-square-dark-300-dpi.png",
                "description": "Email message CO STIX - Email сообщение",
            },	
            "grouping": {
                "link": "grouping-square-dark-300-dpi.png",
                "description": "Grouping DO STIX - Группировка",
            },	
            "identity": {
                "link": "identity-square-dark-300-dpi.png",
                "description": "Identity DO STIX - Идентичность",
            },		
            "incident": {
                "link": "incident-square-dark-300-dpi.png",
                "description": "Incident DO STIX - Инцидент",
            },	
            "indicator": {
                "link": "indicator-square-dark-300-dpi.png",
                "description": "Indicator DO STIX - Индикатор",
            },		
            "infrastructure": {
                "link": "infrastructure-square-dark-300-dpi.png",	
                "description": "Infrastructure DO STIX - Инфраструктура",
            },	
            "intrusion-set": {
                "link": "intrusion-set-square-dark-300-dpi.png",
                "description": "Intrusion Set DO STIX - Набор вторжения",
            },
            "ipv4-addr": {
                "link": "ipv4-addr-square-dark-300-dpi.png",
                "description": "IPv4 address CO STIX - IP адрес версии 4",
            },
            "ipv6-addr": {
                "link": "ipv6-addr-square-dark-300-dpi.png",
                "description": "IPv6 address CO STIX - IP адрес версии 6",
            },
            "location": {
                "link": "location-square-dark-300-dpi.png",
                "description": "Location DO STIX - Местоположение",
            },
            "mac-addr": {
                "link": "mac-addr-square-dark-300-dpi.png",
                "description": "MAC address CO STIX - MAC адрес",
            },
            "malware": {
                "link": "malware-analysis-square-dark-300-dpi.png",
                "description": "Malware DO STIX - Вредоносное программное обеспечение",
            },
            "malware-analysis": {
                "link": "malware-square-dark-300-dpi.png",
                "description": "Malware analysis DO STIX - Анализ вредоносного программного обеспечения",
            },
            "network-traffic": {
                "link": "network-traffic-square-dark-300-dpi.png",
                "description": "Network traffic CO STIX - Сетевой трафик",
            },
            "note": {
                "link": "note-square-dark-300-dpi.png",
                "description": "Note DO STIX - Примечание",
            },
            "observed-data": {
                "link": "observed-data-square-dark-300-dpi.png",
                "description": "Observed Data DO STIX - Наблюдение",
            },
            "opinion": {
                "link": "opinion-square-dark-300-dpi.png",
                "description": "Opinion DO STIX - Мнение",
            },
            "relationship": {
                "link": "relationship-square-dark-300-dpi.png",
                "description": "Relationship RO STIX - Отношение",
            },
            "report": {
                "link": "report-square-dark-300-dpi.png",
                "description": "Report DO STIX - Доклад",
            },
            "sighting": {
                "link": "sighting-square-dark-300-dpi.png",
                "description": "Sighting RO STIX - Визирование",
            },
            "threat-actor": {
                "link": "threat-actor-square-dark-300-dpi.png",
                "description": "Threat actor DO STIX - Исполнитель угроз",
            },
            "tool": {
                "link": "tool-square-dark-300-dpi.png",
                "description": "Tool DO STIX - Инструмент",
            },
            "user-account": {
                "link": "user-account-square-dark-300-dpi.png",
                "description": "User account CO STIX - Учетная запись пользователя",
            },
            "vulnerability": {
                "link": "vulnerability-square-dark-300-dpi.png",
                "description": "Vulnerability DO STIX - Уязвимость",
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