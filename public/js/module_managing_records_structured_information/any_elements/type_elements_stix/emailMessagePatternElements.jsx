import React from "react";
import { Form } from "react-bootstrap";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    TextField,
} from "@material-ui/core";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { JSONTree } from "reactjsontree";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import { 
    CreateReceivedLines, 
    CreateReceivedLinesList, 
    CreateBodyMultipartList,
} from "../anyElements.jsx";
import { CreateShortInformationSTIXObject } from "../createShortInformationSTIXObject.jsx";

const defaultData = "0001-01-01T00:00";
const minDefaultData = Date.now();

export default function CreateEmailMessagePatternElements(props){
    let { 
        isDisabled,
        showRefElement,
        campaignPatterElement, 
        handlerBody,
        handlerSubject,
        handlerDateSend,
        handlerMessageId,
        handlerContentType,
        handlerIsMultipart,
        handlerButtonShowLink,
        handlerAddReceivedLines,
        handlerDeleteReceivedLines,
    } = props;

    let [ expanded, setExpanded ] = React.useState(false);
    let [ refId, setRefId ] = React.useState("");

    let handleExpandClick = (id) => {
        if(id === refId && expanded){
            setExpanded(false);
            
            return;
        }

        if(id !== refId){
            setExpanded(true); 
            setRefId(id);
        } else {            
            setExpanded(!expanded);
        }

        handlerButtonShowLink(id);
    };

    let dateSend = minDefaultData;
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    
    if(currentTimeZoneOffsetInHours > 0){
        if(typeof campaignPatterElement.date !== "undefined" && campaignPatterElement.date.slice(0, 16) !== defaultData){
            dateSend = new Date(Date.parse(campaignPatterElement.date) + ms);
        }
    } else {
        if(typeof campaignPatterElement.date !== "undefined" && campaignPatterElement.date.slice(0, 16) !== defaultData){
            dateSend = new Date(Date.parse(campaignPatterElement.date) - (ms * -1));
        }
    }

    return (<React.Fragment>
        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Содержит ли email сообщение множественные MIME части:</span></Grid>
            <Grid item container md={7} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        //disabled={!isDisabled}
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

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted mt-2">Время когда email сообщение было отправлено:</span>
            </Grid>
            <Grid item container md={7}>
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
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Content-Type</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="content-type-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        handlerContentType(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.content_type)? campaignPatterElement.content_type: ""}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.from_ref && campaignPatterElement.from_ref.length !== 0?
            <Grid container direction="row" spacing={3} className="pt-1">
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Содержимое поля <strong><i>From</i></strong> заголовка email сообщения:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.from_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.from_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.from_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.from_ref && refId === campaignPatterElement.from_ref && expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj}
                                    handlerClick={() => {}} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.sender_ref && campaignPatterElement.sender_ref.length !== 0?
            <Grid container direction="row" spacing={3}>
                <Grid item container md={5} justifyContent="flex-end">
                    <span className="text-muted mt-3">Содержимое поля <strong><i>Sender</i></strong> заголовка email сообщения:</span>
                </Grid>
                <Grid item container md={7}>
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.sender_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.sender_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                &nbsp;{campaignPatterElement.sender_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.sender_ref && refId === campaignPatterElement.sender_ref && expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj} 
                                    handlerClick={() => {}} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>:
            ""}

        {campaignPatterElement.to_refs && (typeof campaignPatterElement.to_refs !== "undefined") && campaignPatterElement.to_refs.length > 0?
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

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_rf_to_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj}
                                            handlerClick={() => {}}
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.cc_refs && (typeof campaignPatterElement.to_refs !== "undefined") && campaignPatterElement.cc_refs.length > 0?
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

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_rf_cc_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj}
                                            handlerClick={() => {}} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        {campaignPatterElement.bcc_refs && (typeof campaignPatterElement.to_refs !== "undefined") && campaignPatterElement.bcc_refs.length > 0?
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

                            return (<Card variant="outlined" style={{ width: "100%", paddingTop: 1 }} key={`key_rf_bcc_ref_${key}`}>
                                <CardActions>
                                    <Button onClick={() => { 
                                        handleExpandClick(item);
                                    }}>
                                        <img 
                                            src={`/images/stix_object/${objectElem.link}`} 
                                            width="25" 
                                            height="25" />
                                        &nbsp;{item}
                                    </Button>
                                </CardActions>
                                <Collapse in={showRefElement.id === item && refId === item && expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <CreateShortInformationSTIXObject 
                                            obj={showRefElement.obj} 
                                            handlerClick={() => {}} 
                                        />
                                    </CardContent>
                                </Collapse>
                            </Card>);
                        })}
                    </Grid>
                </Grid>
            </React.Fragment>:
            ""}

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Message-ID</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="message-id-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        handlerMessageId(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.message_id)? campaignPatterElement.message_id: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={5} justifyContent="flex-end"><span className="text-muted mt-2">Содержимое поля <strong><i>Subject</i></strong> заголовка email сообщения:</span></Grid>
            <Grid item container md={7}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="subject-element"
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={(e) => {
                        handlerSubject(e);
                    }}
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.subject)? campaignPatterElement.subject: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Список элементов поля заголовка <strong><i>Received</i></strong>:</span>
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

        <Grid container direction="row">
            <Grid item container md={12} justifyContent="flex-start"><span className="text-muted mt-2 mb-2">Содержимое поля <strong><i>Body</i></strong> email сообщения:</span></Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item container md={12}>
                <TextField
                    fullWidth
                    disabled={isDisabled}
                    id="body-element"
                    multiline
                    minRows={4}
                    InputLabelProps={{ shrink: true }}
                    //error={isInvalidValue}
                    onChange={handlerBody}
                    variant="outlined"
                    //helperText="обязательное для заполнения поле"
                    value={(campaignPatterElement.body)? campaignPatterElement.body: ""}
                />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} className="mt-2">
            <Grid item container md={5} justifyContent="flex-end">
                <span className="text-muted  mt-3">Ссылка на {"\"сырое\""} (бинарное) содержимое email сообщения:</span>
            </Grid>
            <Grid item container md={7}>
                {campaignPatterElement.raw_email_ref && (typeof campaignPatterElement.raw_email_ref !== "undefined") && campaignPatterElement.raw_email_ref.length !== 0?
                    <Card variant="outlined" style={{ width: "100%" }}>
                        <CardActions>
                            <Button onClick={() => { 
                                handleExpandClick(campaignPatterElement.raw_email_ref);
                            }}>
                                <img 
                                    src={`/images/stix_object/${helpers.getLinkImageSTIXObject(campaignPatterElement.raw_email_ref.split("--")[0]).link}`} 
                                    width="25" 
                                    height="25" />
                                    &nbsp;{campaignPatterElement.raw_email_ref}
                            </Button>
                        </CardActions>
                        <Collapse in={showRefElement.id === campaignPatterElement.raw_email_ref && refId === campaignPatterElement.raw_email_ref && expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <CreateShortInformationSTIXObject 
                                    obj={showRefElement.obj}
                                    handlerClick={() => {}} 
                                />
                            </CardContent>
                        </Collapse>
                    </Card>:
                    ""}
            </Grid>
        </Grid>

        <CreateBodyMultipartList
            isDisabled={isDisabled}
            refId={refId}
            expanded={expanded}
            showRefElement={showRefElement}
            listBodyMultipart={(!campaignPatterElement.body_multipart)? []: campaignPatterElement.body_multipart}
            handlerRefId={(refId) => {
                setRefId(refId);
            }}
            handlerExpanded={(status) => {
                setExpanded(status);
            }}
            handlerButtonShowLink={handlerButtonShowLink}
        />
 
        {
            //
            //      поле additional_header_fields, пока не очень хорошо реализованно в ISEMS-MRSICT
            // пока оставляю как есть, но в перспективе нужно внести нектороые изменения в соответствующий тип
            // данного объекта в ISEMS-MRSICT
            // 
            (campaignPatterElement !== null && campaignPatterElement.additional_header_fields)?
                Object.keys(campaignPatterElement.additional_header_fields).length === 0?
                    "":
                    <React.Fragment>
                        <Grid container direction="row" className="mt-2">
                            <Grid item md={12}><span className="text-muted">Дополнительная информация, относящаяся к объекту:</span></Grid>
                        </Grid>
                        <Grid container direction="row" className="mt-2">
                            <Grid item md={12}>
                                {(campaignPatterElement !== null && campaignPatterElement.additional_header_fields)?
                                    <JSONTree 
                                        data={campaignPatterElement.additional_header_fields} 
                                        theme={{
                                            base00: "#272822",
                                            base01: "#383830",
                                            base02: "#49483e",
                                            base03: "#75715e",
                                            base04: "#a59f85",
                                            base05: "#f8f8f2",
                                            base06: "#f5f4f1",
                                            base07: "#f9f8f5",
                                            base08: "#f92672",
                                            base09: "#fd971f",
                                            base0A: "#f4bf75",
                                            base0B: "#a6e22e",
                                            base0C: "#a1efe4",
                                            base0D: "#66d9ef",
                                            base0E: "#ae81ff",
                                            base0F: "#cc6633",
                                        }}
                                        hideRoot
                                    />:
                                    ""}    
                            </Grid>
                        </Grid>
                    </React.Fragment>:
                ""
        }
    </React.Fragment>);
}

CreateEmailMessagePatternElements.propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    showRefElement: PropTypes.object.isRequired,
    campaignPatterElement: PropTypes.object.isRequired,
    handlerBody: PropTypes.func.isRequired,
    handlerSubject: PropTypes.func.isRequired,
    handlerDateSend: PropTypes.func.isRequired,
    handlerMessageId: PropTypes.func.isRequired,
    handlerContentType: PropTypes.func.isRequired,
    handlerIsMultipart: PropTypes.func.isRequired,
    handlerButtonShowLink: PropTypes.func.isRequired,
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