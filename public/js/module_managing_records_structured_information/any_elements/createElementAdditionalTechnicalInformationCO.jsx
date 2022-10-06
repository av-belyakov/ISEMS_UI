import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { 
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography, 
    TextField,
    Grid,
    IconButton,
} from "@material-ui/core";
import IconDeleteOutline from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { grey, green, red } from "@material-ui/core/colors";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    customPaper: {
        width: "100%",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        margin: theme.spacing(1),
    },
    buttonCreateElement: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700],
        },
    },
    formControlTypeHashRE: {
        minWidth: 120,
    },
}));

export default function CreateElementAdditionalTechnicalInformationCO(props){
    let { 
        objectId,
        reportInfo, 
        isNotDisabled,
        handlerElementDefanged, 
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    let handlerElDef = (data) => {
        handlerElementDefanged({ data: data.target.value, objectId: objectId }); 
    };

    return (<React.Fragment>
        <Grid container direction="row" className="mt-4">
            <Grid item md={12}><span className="text-muted"><strong>Дополнительная техническая информация</strong></span></Grid>
        </Grid>

        <Grid container direction="row" spacing={3} className="mt-3 pl-4">
            <Grid item md={4} className="text-end"><span className="text-muted">Версия спецификации STIX:</span></Grid>
            <Grid item md={8} className="text-start">
                {(reportInfo.id && reportInfo.id !== "")?
                    ((typeof reportInfo.spec_version === "undefined") || (reportInfo.spec_version.length === 0))? 
                        <span className="text-dark">версия не определена</span>: 
                        <i>{reportInfo.spec_version}</i>:
                    "2.1"
                }
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} className="pl-4 mt-1 mb-3">
            <Grid item md={4} className="text-end mt-1"><span className="text-muted">Определены ли данные содержащиеся в объекте:</span></Grid>
            <Grid item container md={8} justifyContent="flex-start">
                <Form.Group>
                    <Form.Control 
                        disabled={!isNotDisabled}
                        as="select" 
                        size="sm" 
                        onChange={handlerElDef} 
                        value={reportInfo.defanged} 
                        id="dropdown_list_defanged" >
                        <option key={"key_defanged_true"} value={true}>да</option>
                        <option key={"key_defanged_false"} value={false}>нет</option>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>

        <Grid container direction="row" className="mt-2">
            <Grid item md={12}><span className="text-muted">Дополнительные {"\"гранулярные\""} метки:</span></Grid>
        </Grid>
        <GetGranularMarkings
            objectId={objectId}
            reportInfo={reportInfo}
            handlerElementDelete={handlerElementDelete}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
        />

        {
            //в поле extensions будут различные расширения, пока не реализованно в ISEMS-MRSICT
            (reportInfo !== null && reportInfo.extensions)?
                Object.keys(reportInfo.extensions).length === 0?
                    "":
                    <React.Fragment>
                        <Grid container direction="row" className="mt-2">
                            <Grid item md={12}><span className="text-muted">Дополнительная информация, относящаяся к объекту:</span></Grid>
                        </Grid>
                        <Grid container direction="row" className="mt-2">
                            <Grid item md={12}><strong>{JSON.stringify(reportInfo.extensions, null, 2)}</strong></Grid>
                        </Grid>
                    </React.Fragment>:
                ""
        }
    </React.Fragment>);
}

CreateElementAdditionalTechnicalInformationCO.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool,
    handlerElementDefanged: PropTypes.func.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};

/*
//OptionalCommonPropertiesCyberObservableObjectSTIX содержит опциональные общие свойства для Cyber-observable Objects STIX
// SpecVersion - версия STIX спецификации.
// Defanged - определяет были ли определены данные содержащиеся в объекте
// ObjectMarkingRefs - определяет список ID ссылающиеся на объект "marking-definition", по терминалогии STIX, в котором содержатся
// значения применяющиеся к этому объекту
// GranularMarkings - определяет список "гранулярных меток" (granular_markings) относящихся к этому объекту
// Extensions - может содержать дополнительную информацию, относящуюся к объекту
type OptionalCommonPropertiesCyberObservableObjectSTIX struct {
	SpecVersion       string                        `json:"spec_version" bson:"spec_version"`
string	ObjectMarkingRefs []IdentifierTypeSTIX          `json:"object_marking_refs" bson:"object_marking_refs"`
	GranularMarkings  []GranularMarkingsTypeSTIX    `json:"granular_markings" bson:"granular_markings"`
	Defanged          bool                          `json:"defanged" bson:"defanged"`
{ dictionary: interface{} }	Extensions        map[string]DictionaryTypeSTIX `json:"extensions" bson:"extensions"`

//GranularMarkingsTypeSTIX тип "granular_markings", по терминалогии STIX, представляет собой набор маркеров ссылающихся на свойства "marking_ref" и "lang"
// Lang - идентифицирует язык соответствующим маркером
// MarkingRef - определяет идентификатор объекта "marking-definition"
// Selectors - определяет список селекторов для содержимого объекта STIX, к которому применяется это свойство
type GranularMarkingsTypeSTIX struct {
	Lang       string             `json:"lang" bson:"lang"`
string	MarkingRef IdentifierTypeSTIX `json:"marking_ref" bson:"marking_ref"`
	Selectors  []string           `json:"selectors" bson:"selectors"`
}
}
*/

//дополнительные внешние ссылки
function GetGranularMarkings(props){
    let {  
        objectId,
        reportInfo,
        handlerElementDelete,
        handlerDialogElementAdditionalThechnicalInfo,
    } = props;

    const classes = useStyles();
    let patternValueGM = {
        lang: "",
        marking_ref: "",
        selectors: [],
    };
    let [ valueGM, setValueGM ] = useState(patternValueGM);
    let [ valueTmpSelector, setValueTmpSelector ] = useState("");
    let [ buttonAddNewGMIsDisabled, setButtonAddNewGMIsDisabled ] = useState(true);
    let [ buttonAddSelectorIsDisabled, setButtonAddSelectorIsDisabled ] = useState(true);

    let handlerDelSelector = (num) => {
        let tmp = _.cloneDeep(valueGM);
        tmp.selectors.splice(num, 1);

        if(tmp.selectors.length === 0){
            setButtonAddNewGMIsDisabled(true);
        }

        setValueGM(tmp);
    };

    return (<Grid container direction="row" key="key_granular_markings_link">
        <Grid container direction="row" spacing={3}>
            <Grid item md={2}>
                <TextField
                    id="granular-markings-lang"
                    label="маркер языка"
                    fullWidth={true}
                    value={valueGM.lang}
                    onChange={(e) => {
                        let valueGMTmp = _.cloneDeep(valueGM);

                        valueGMTmp.lang = e.target.value.toUpperCase();
                        setValueGM(valueGMTmp);
                    }}
                />
            </Grid>
            <Grid item md={10}>
                <Grid container direction="row">
                    <Grid item md={9}>
                        <TextField
                            id="granular-markings-marking-ref"
                            label="идентификатор объекта 'marking-definition'"
                            fullWidth={true}
                            value={valueGM.marking_ref}
                            onChange={(e) => {
                                let valueGMTmp = _.cloneDeep(valueGM);

                                valueGMTmp.marking_ref = e.target.value;
                                setValueGM(valueGMTmp);
                            }}
                        />
                    </Grid>
                    <Grid item md={3} className="text-start mt-2">
                        <Button onClick={() => {
                            let valueGMTmp = _.cloneDeep(valueGM);

                            valueGMTmp.marking_ref = `marking-definition--${uuidv4()}`;
                            setValueGM(valueGMTmp);
                        }}>
                            сгенерировать
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid container direction="row" key="key_input_hash_field">
            <Grid item md={7}>
                <TextField
                    id="marking-definition-selector"
                    label="идентификатор селектора"
                    fullWidth
                    value={valueTmpSelector}
                    onChange={(e) => {
                        setValueTmpSelector(e.target.value);
                        (e.target.value.length === 0)? setButtonAddSelectorIsDisabled(true): setButtonAddSelectorIsDisabled(false);
                    }}
                />
            </Grid>
            <Grid item md={2} className="text-start mt-2">
                <Button onClick={() => {
                    setValueTmpSelector(`selector--${uuidv4()}`);
                    setButtonAddSelectorIsDisabled(false);
                }} >
                    сгенерировать
                </Button>
            </Grid>
            <Grid item md={3} className="text-end mt-2">
                <Button 
                    onClick={() => {
                        if(valueTmpSelector === ""){
                            return;
                        }

                        let valueGMTmp = _.cloneDeep(valueGM);

                        valueGMTmp.selectors.push(valueTmpSelector);
                        setValueGM(valueGMTmp);
                        setValueTmpSelector("");

                        setButtonAddNewGMIsDisabled(false);
                        setButtonAddSelectorIsDisabled(true);
                    }} 
                    disabled={buttonAddSelectorIsDisabled} 
                    color="primary" >
                        добавить селектор
                </Button>
            </Grid>
        </Grid>

        {(valueGM.selectors.length === 0) ? 
            "" : 
            <Grid container direction="row" className="mt-3">
                <ol>
                    {valueGM.selectors.map((item, num) => {
                        return (<li key={`key_item_selector_${num}`}>
                            {item}&nbsp;
                            <IconButton aria-label="delete-selector" onClick={() => handlerDelSelector.call(null, num)}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                            </IconButton>
                        </li>);
                    })}
                </ol>
            </Grid>}

        <Grid container direction="row" key="key_granular_markings_link">
            <Grid item md={12} className="text-end pt-2 pb-2">
                <Button onClick={() => {
                    let tmpData = _.cloneDeep(valueGM);
                    setValueGM(patternValueGM);
                    setButtonAddNewGMIsDisabled(true);

                    tmpData.external_id = `granular_markings--${uuidv4()}`;

                    handlerDialogElementAdditionalThechnicalInfo({ 
                        actionType: "new",
                        modalType: "granular_markings", 
                        objectId: objectId,
                        orderNumber: -1,
                        data: tmpData,
                    });
                }} disabled={buttonAddNewGMIsDisabled}>
                    {"добавить новую \"гранулярную метку\""}
                </Button>
            </Grid>
        </Grid>

        {((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0))?
            "":
            reportInfo.granular_markings.map((item, key) => {
                let markingRef = "";

                if((typeof item.marking_ref !== "undefined") && (item.marking_ref !== null) && (item.marking_ref.length !== 0)){
                    markingRef = item.marking_ref;
                }

                return (<Card className={classes.customPaper} key={`key_granular_markings_${key}_fragment`}>
                    <CardHeader 
                        subheader={markingRef}
                        action={<React.Fragment>
                            <IconButton aria-label="delete" onClick={()=>{ 
                                handlerElementDelete({ 
                                    itemType: "granular_markings", 
                                    item: markingRef,
                                    orderNumber: key,
                                    objectId: objectId }); 
                            }}>
                                <IconDeleteOutline style={{ color: red[400] }} />
                            </IconButton>
                        </React.Fragment>} />
                    <CardContent>
                        {((typeof item.lang === "undefined") || (item.lang === null) || (item.lang.length === 0) ? 
                            "": 
                            <Grid container direction="row" key={`key_granular_mark_${key}_2`}>
                                <Grid item md={12}>
                                    <Typography variant="body2" component="p"><span className="text-muted">текстовый код языка:</span> {item.lang}</Typography>
                                </Grid>
                            </Grid>)}

                        {((item.selectors === null) && (typeof item.selectors === "undefined"))?
                            "":
                            <Grid container direction="row" key={`key_granular_mark_${key}_3`}>
                                <Grid item md={12}>
                                    <span>
                                        <span className="text-muted">список селекторов для содержимого объекта STIX, к которому применяется это свойство:</span>
                                        <ol>{item.selectors.map((i, num) => {
                                            return <li key={`hash_${i.selectors}_${num}`}>{i}</li>;
                                        })}</ol>
                                    </span>
                                </Grid>
                            </Grid>}
                    </CardContent>
                </Card>);
            })}
    </Grid>);
}

GetGranularMarkings.propTypes = {
    objectId: PropTypes.string.isRequired,
    reportInfo: PropTypes.object.isRequired,
    handlerElementDelete: PropTypes.func.isRequired,
    handlerDialogElementAdditionalThechnicalInfo: PropTypes.func.isRequired,
};
