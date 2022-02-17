export default {            
    documentsId: [],
    documentsType: ["report"],
    /**  
     * если заполнены оба поля 'created' и 'modified' то тогда для поиска по данным из обоих полей работает логика "ИЛИ"
     * значение "0001-01-01T00:00:00.000+00:00" для полей с датами эквивалентно значению пустого поля
     */
    created: {
        start: "0001-01-01T00:00:00.000+00:00",
        end: "0001-01-01T00:00:00.000+00:00",
    },
    modified: {
        start: "0001-01-01T00:00:00.000+00:00",
        end: "0001-01-01T00:00:00.000+00:00",
    }, 
    createdByRef: "",
    /** 
     * specific_search_fields содержит специфичные поля объектов STIX (если для поиска используются НЕСКОЛЬКО таких объектов 
     * то срабатывает логика "ИЛИ").
     * Если в объекте заполнены несколько полей то между ними работает логика "И", со всеми полями кроме полей даты.
     * Для поля "Value" выполняется проверка на соответствия одному из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
     * "ipv6-addr" или "url" 
     */
    specificSearchFields: [
        {
            name: "",
            aliases: [],
            /* интервал времени когда информация была обнаружена впервые */
            firstSeen: {
                start: "0001-01-01T00:00:00.000+00:00",
                end: "0001-01-01T00:00:00.000+00:00",
            },
            /* интервал времени когда информация была обнаружена в последний раз */
            lastSeen: {
                start: "0001-01-01T00:00:00.000+00:00",
                end: "0001-01-01T00:00:00.000+00:00",
            },
            /* равно или больше чем заданное пользователем время, когда отчет был опубликован */
            published: "1970-01-01T00:00:00.000+00:00",
            roles: [],
            country: "",
            city: "",
            numberAutonomousSystem: 0,
            /**
             * может содержать какое либо из следующих типов значений: "domain-name", "email-addr", "ipv4-addr", 
             * "ipv6-addr" или "url". Или все эти значения в перемешку. Между значениями в поле 'Value' используется
             * логика "ИЛИ".
             */
            value: [],
        }
    ],
    /** 
     * содержит поля не входящие в основную спецификацию STIX 2.0 и расширяющие набор некоторых свойств 
     * объектов STIX. Логика между ними это "ИЛИ", пустое содержимое полей не учитывается 
     */
    outsideSpecificationSearchFields: {
        decisionsMadeComputerThreat: "", // принятые решения по компьютерной угрозе
        computerThreatType: "", // тип компьютерной угрозы
    },
};