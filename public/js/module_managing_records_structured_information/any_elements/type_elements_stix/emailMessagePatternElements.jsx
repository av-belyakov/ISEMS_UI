import React from "react";
import { Form } from "react-bootstrap";
import {
    Button,
    Grid,
    Link,
    TextField,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import { CreateReceivedLines, CreateReceivedLinesList } from "../anyElements.jsx";

const minDefaultData = "0001-01-01T00:00:00Z";

export default function CreateEmailMessagePatternElements(props){
    let { 
        isDisabled,
        campaignPatterElement, 
        handlerIsMultipart,
        handlerDateSend,
        handlerContentType,
        handlerMessageId,
        handlerSubject,
        handlerAddReceivedLines,
        handlerDeleteReceivedLines,
    } = props;

    console.log("func 'CreateEmailMessagePatternElements', campaignPatterElement:", campaignPatterElement);

    //let [ isInvalidValue, setIsInvalidValue ] = React.useState(((typeof campaignPatterElement.value === "undefined") || (campaignPatterElement.value === "")));

    let dateSend = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.date !== "undefined" && campaignPatterElement.date !== dateSend){
            dateSend = new Date(Date.parse(campaignPatterElement.date) + ms);
        }
    } else {
        if(typeof campaignPatterElement.date !== "undefined" && campaignPatterElement.date !== dateSend){
            dateSend = new Date(Date.parse(campaignPatterElement.date) - (ms * -1));
        }
    }

    return (<React.Fragment>
        <Grid container direction="row" className="pl-4 mt-1 mb-3">
            <Grid item container md={10} justifyContent="flex-end"><span className="text-muted">Содержит ли email сообщение множественные MIME части:</span></Grid>
            <Grid item container md={2} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        //disabled={!isNotDisabled}
                        as="select" 
                        size="sm" 
                        onChange={handlerIsMultipart} 
                        value={campaignPatterElement.is_multipart} 
                        id="dropdown_list_is_multipart" >
                        <option key={"key_is_multipart_true"} value={true}>да</option>
                        <option key={"key_is_multipart_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Время когда email сообщение было отправлено:</span>
            </Grid>
            <Grid item container md={8}>
                {isDisabled?
                    helpers.convertDateFromString(dateSend, { monthDescription: "long", dayDescription: "numeric" }):
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            variant="inline"
                            ampm={false}
                            value={dateSend}
                            minDate={new Date("2002-01-01")}
                            maxDate={new Date()}
                            onChange={handlerDateSend}
                            format="dd.MM.yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Content-Type</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="content-type-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        /*if(e.target.value === "" || !helpers.checkInputValidation({ name: "domanName", value: e.target.value })){
                                setIsInvalidValue(true);
                            } else {
                                setIsInvalidValue(false);
                            }*/

                        handlerContentType(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.content_type)? campaignPatterElement.content_type: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>From</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={8}>
                {campaignPatterElement.from_ref && campaignPatterElement.from_ref.length !== 0?
                    <React.Fragment>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                <Button onClick={() => {}} disabled>
                                    <img 
                                        src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.from_ref.split("--")[0]).link}`} 
                                        width="35" 
                                        height="35" />
                                    &nbsp;{campaignPatterElement.from_ref}
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>:
                    ""}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted mt-2">Содержимое поля <strong><i>Sender</i></strong> заголовка email сообщения:</span>
            </Grid>
            <Grid item container md={8}>
                {campaignPatterElement.sender_ref && campaignPatterElement.sender_ref.length !== 0?
                    <React.Fragment>
                        <Grid container direction="row">
                            <Grid item container md={12} justifyContent="flex-start">
                                <Button onClick={() => {}} disabled>
                                    <img 
                                        src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.sender_ref.split("--")[0]).link}`} 
                                        width="35" 
                                        height="35" />
                                    &nbsp;{campaignPatterElement.sender_ref}
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>:
                    ""}
            </Grid>
        </Grid>

        {campaignPatterElement.to_refs && campaignPatterElement.to_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>To</i></strong>):</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.to_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Grid container direction="row" key={`key_to_ref_${key}`}>
                                <Grid item container md={12} justifyContent="flex-start">
                                    <Button onClick={() => {}} disabled>
                                        <img 
                                            key={`key_to_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="35" 
                                            height="35" />
                                        &nbsp;{item}&nbsp;
                                    </Button>
                                </Grid>
                            </Grid>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.cc_refs && campaignPatterElement.cc_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>CC</i></strong>):</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.cc_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Grid container direction="row" key={`key_cc_ref_${key}`}>
                                <Grid item container md={12} justifyContent="flex-start">
                                    <Button onClick={() => {}} disabled>
                                        <img 
                                            key={`key_cc_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="35" 
                                            height="35" />
                                        &nbsp;{item}&nbsp;
                                    </Button>
                                </Grid>
                            </Grid>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.bcc_refs && campaignPatterElement.bcc_refs.length > 0?
            <React.Fragment>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        <span className="text-muted">Список почтовых ящиков, которые являются получателями сообщения электронной почты (содержимое поля <strong><i>BCC</i></strong>):</span>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                    <Grid item container md={12} justifyContent="flex-start">
                        {campaignPatterElement.bcc_refs.map((item, key) => {
                            let type = item.split("--");
                            let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                            if(typeof objectElem === "undefined" ){
                                return "";
                            }

                            return (<Grid container direction="row" key={`key_bcc_ref_${key}`}>
                                <Grid item container md={12} justifyContent="flex-start">
                                    <Button onClick={() => {}} disabled>
                                        <img 
                                            key={`key_bcc_ref_type_${key}`} 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="35" 
                                            height="35" />
                                        &nbsp;{item}&nbsp;
                                    </Button>
                                </Grid>
                            </Grid>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Message-ID</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="message-id-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        /*if(e.target.value === "" || !helpers.checkInputValidation({ name: "domanName", value: e.target.value })){
                                setIsInvalidValue(true);
                            } else {
                                setIsInvalidValue(false);
                            }*/

                        handlerMessageId(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.message_id)? campaignPatterElement.message_id: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Subject</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={8}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="subject-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        /*if(e.target.value === "" || !helpers.checkInputValidation({ name: "domanName", value: e.target.value })){
                                setIsInvalidValue(true);
                            } else {
                                setIsInvalidValue(false);
                            }*/

                        handlerSubject(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.subject)? campaignPatterElement.subject: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Список элементов поля заголовка <strong><i>Received</i></strong></span>
            </Grid>
        </Grid>
        <CreateReceivedLines
            isDisabled={isDisabled}
            handlerAddReceivedLines={handlerAddReceivedLines}
        /> 
        <CreateReceivedLinesList
            isDisabled={isDisabled}
            listReceivedLines={(!campaignPatterElement.received_lines)? []: campaignPatterElement.received_lines}
            handlerDeleteItem={handlerDeleteReceivedLines}
        />

        {/**

         Нужно доделать следующие свойства

        // AdditionalHeaderFields - содержит любые другие поля заголовка (за исключением date, received_lines, content_type, from_ref,
        //  sender_ref, to_ref, cc_ref, bcc_refs и subject), найденные в сообщении электронной почты в виде словаря
        // Body - содержит тело сообщения
        // BodyMultipart - содержит адает список MIME-части, которые составляют тело email. Это свойство НЕ ДОЛЖНО использоваться, если
        //  is_multipart имеет значение false
        // RawEmailRef - содержит 'сырое' бинарное содержимое email сообщения
         */}
    </React.Fragment>);
}

CreateEmailMessagePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerIsMultipart: PropTypes.func.isRequired,
    handlerDateSend: PropTypes.func.isRequired,
    handlerContentType: PropTypes.func.isRequired,
    handlerMessageId: PropTypes.func.isRequired,
    handlerSubject: PropTypes.func.isRequired,
    handlerAddReceivedLines: PropTypes.func.isRequired,
    handlerDeleteReceivedLines: PropTypes.func.isRequired,
};

/**
//EmailMessageCyberObservableObjectSTIX объект "Email Message", по терминалогии STIX, содержит экземпляр email сообщения
// IsMultipart - информирует содержит ли 'тело' email множественные MIME части (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Date - время, в формате "2016-05-12T08:17:27.000Z", когда email сообщение было отправлено
// ContentType - содержит содержимое 'Content-Type' заголовка email сообщения
// FromRef - содержит содержимое 'From:' заголовка email сообщения
// SenderRef - содержит содержимое поля 'Sender:' email сообщения
// ToRefs - содержит список почтовых ящиков, которые являются получателями сообщения электронной почты, содержимое поля 'To:'
// CcRefs - содержит список почтовых ящиков, которые являются получателями сообщения электронной почты, содержимое поля 'CC:'
// BccRefs - содержит список почтовых ящиков, которые являются получателями сообщения электронной почты, содержимое поля 'BCC:'
// MessageID - содержимое Message-ID email сообщения
// Subject - содержит тему сообщения
// ReceivedLines - содержит одно или несколько полей заголовка 'Received', которые могут быть включены в заголовки email
// AdditionalHeaderFields - содержит любые другие поля заголовка (за исключением date, received_lines, content_type, from_ref,
//  sender_ref, to_ref, cc_ref, bcc_refs и subject), найденные в сообщении электронной почты в виде словаря
// Body - содержит тело сообщения
// BodyMultipart - содержит адает список MIME-части, которые составляют тело email. Это свойство НЕ ДОЛЖНО использоваться, если
//  is_multipart имеет значение false
// RawEmailRef - содержит 'сырое' бинарное содержимое email сообщения
type EmailMessageCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	IsMultipart            bool                          `json:"is_multipart" bson:"is_multipart" required:"true"`
	Date                   time.Time                     `json:"date" bson:"date"`
	ContentType            string                        `json:"content_type" bson:"content_type"`
	FromRef                IdentifierTypeSTIX   string         `json:"from_ref" bson:"from_ref"`
	SenderRef              IdentifierTypeSTIX   string         `json:"sender_ref" bson:"sender_ref"`
	ToRefs                 []IdentifierTypeSTIX  string        `json:"to_refs" bson:"to_refs"`
	CcRefs                 []IdentifierTypeSTIX  string        `json:"cc_refs" bson:"cc_refs"`
	BccRefs                []IdentifierTypeSTIX  string        `json:"bcc_refs" bson:"bcc_refs"`
	MessageID              string                        `json:"message_id" bson:"message_id"`
	Subject                string                        `json:"subject" bson:"subject"`
	ReceivedLines          []string                      `json:"received_lines" bson:"received_lines"`
	AdditionalHeaderFields map[string]DictionaryTypeSTIX `json:"additional_header_fields" bson:"additional_header_fields"`
	Body                   string                        `json:"body" bson:"body"`
	BodyMultipart          []EmailMIMEPartTypeSTIX       `json:"body_multipart" bson:"body_multipart"`
	RawEmailRef            IdentifierTypeSTIX  string          `json:"raw_email_ref" bson:"raw_email_ref"`
}
//DictionaryTypeSTIX тип "dictionary", по терминалогии STIX, содержащий значения любых типов
type DictionaryTypeSTIX struct {
	dictionary interface{}
}

//EmailMIMEPartTypeSTIX тип "email-mime-part-type", по терминалогии STIX, содержит один компонент тела email из нескольких частей
// Body - содержит содержимое части MIME, если content_type не указан или начинается с text/ (например, в случае обычного текста или HTML-письма)
// BodyRawRef - содержит содержимое нетекстовых частей MIME, то есть тех, чей content_type не начинается с text, в качестве
//  ссылки на объект артефакта или Файловый объект
// ContentType - содержимое поля 'Content-Type' заголовка MIME части email
// ContentDisposition - содержимое поля 'Content-Disposition' заголовка MIME части email
type EmailMIMEPartTypeSTIX struct {
	Body               string             `json:"body" bson:"body"`
	BodyRawRef         IdentifierTypeSTIX string `json:"body_raw_ref" bson:"body_raw_ref"`
	ContentType        string             `json:"content_type" bson:"content_type"`
	ContentDisposition string             `json:"content_disposition" bson:"content_disposition"`
}
 */