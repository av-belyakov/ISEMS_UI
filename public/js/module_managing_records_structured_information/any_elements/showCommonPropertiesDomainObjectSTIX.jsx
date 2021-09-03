import React from "react";
import { Col, Row } from "react-bootstrap";
import { Card, CardContent, CardHeader, Chip, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

/*export default class ShowCommonPropertiesDomainObjectSTIX extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        let reportInfo = this.props.commonData;

        let getExternalReferences = () => {
            // *** для теста START ***
            let lister = [
                {
                    source_name: "external references 1",
                    description: "common description external references 1 to read people",
                    url: "html://external-references-example-1.net/watch?v=BSoHDCWze7E",
                    hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                    external_id: "ex-ref--vueueuf8egfurggrg7gd7fe",
                },
                {
                    source_name: "external references 2",
                    description: "common description external references 2 to read people",
                    url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                    hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha128": "nbeiuu37fg7g4f7g84g8gd8fg8eg8egf8e", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                    external_id: "ex-ref--beg77e7fd3f377gr7eg7efg7",
                },
                {
                    source_name: "external references 3",
                    url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                    external_id: "ex-ref--cbscvsvcvdvucvduvduvcduvbduv",
                },
            ];
            reportInfo.external_references = lister;
            // *** для теста END ***

            if((typeof reportInfo.external_references === "undefined") || (reportInfo.external_references === null) || (reportInfo.external_references.length === 0)){
                return;
            }

            let externalReferences = () => {
                return reportInfo.external_references.map((item, key) => {
                    let listHashes = [];

                    if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                        for(let k in item.hashes){
                            listHashes.push(<li key={`hash_${item.hashes[k]}`}>{k}: {item.hashes[k]}</li>);
                        }    
                    }

                    return (<Row key={`key_row_${key}`}>
                        <Col className="mb-2">
                            <CreateExternalReferencesCard item={item} listHashes={listHashes}/>
                        </Col>
                    </Row>);
                });
            };

            return (
                <Row>
                    <Col md={4} className="text-left"><span className="text-muted">дополнительные, внешние ссылки</span>:</Col>
                    <Col md={8}>{externalReferences()}</Col>
                </Row>
            );
        };
        let getGranularMarkings = () => {
            // *** для теста START ***
            let lister = [
                {
                    lang: "CH",
                    marking_ref: "marking--bubdu8eeugfuegfe8fefhefe",
                    selectors: ["selectors_suvnid_1", "selectors_cvbi_2"],
                },
                {
                    lang: "US",
                    marking_ref: "marking-- cscusuudbsfubdufbudbfueubue",
                },
                {
                    lang: "RU",
                    selectors: ["selectors-bdufbdubudfud", "selectors-sufuwu3fueuef", "selectors-dufveufueufuefu"],
                },
            ];
            reportInfo.granular_markings = lister;
            // *** для теста END ***

            if((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0)){
                return;
            }

            let granularMarkings = () => {
                return reportInfo.granular_markings.map((item, key) => {
                    let listSelectors = [];

                    if((item.selectors !== null) && (typeof item.selectors !== "undefined")){
                        for(let k in item.selectors){
                            listSelectors.push(<li key={`hash_${item.selectors[k]}`}>{k}: {item.selectors[k]}</li>);
                        }    
                    }

                    return (<Row key={`key_row_${key}`}>
                        <Col className="mb-2">
                            <CreateGranularMarkings item={item} listSelectors={listSelectors}/>
                        </Col>
                    </Row>);
                });
            };

            return (
                <Row>
                    <Col md={4} className="text-left"><span className="text-muted">дополнительные, {"\"гранулярные метки\""}</span>:</Col>
                    <Col md={8}>{granularMarkings()}</Col>
                </Row>
            );
        };
        let getExtensions = () => {
            reportInfo.extensions = { "test element": "budbuufbduf fndufbud ufbdgufgur", "test element 1": "bvbibevi484negfgrgiurg" };

            if((typeof reportInfo.extensions === "undefined") && (reportInfo.extensions === null) && (reportInfo.extensions.length === 0)){
                return;
            }   

            let  listExtensions = [];
            for(let k in reportInfo.extensions){
                listExtensions.push(<li key={`extensions_${k}`}>{k} - {reportInfo.extensions[k]}</li>);
            }

            return (<Row>
                <Col md={4} className="text-left"><span className="text-muted">любая дополнительная информация</span>:</Col>
                <Col md={8}><ul>{listExtensions}</ul></Col>
            </Row>);
        };

        return (<React.Fragment>
            <Row className="mt-2 mb-2">
                <Col md={12} className="text-center">Дополнительная техническая информация</Col>                                
            </Row>
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">версия спецификации STIX</span>:</Col>
                <Col md={6} className="text-center">{(reportInfo.spec_version.length === 0) ? <span className="text-dark">версия не определена</span> : <i>{reportInfo.spec_version}</i>}</Col>
            </Row>
            {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">текстовый код языка</span>:</Col>
                    <Col md={6} className="text-center"><i>{reportInfo.lang.toUpperCase()}</i></Col>
                </Row> : ""}
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100</span>&sup1;:</Col>
                <Col md={6} className="text-center"><i>{reportInfo.confidence}</i></Col>
            </Row>
            {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">идентификатор источника создавшего доклад</span>:</Col>
                    <Col md={6} className="text-center"><i>{reportInfo.created_by_ref}</i></Col>
                </Row> : ""}
            {((typeof reportInfo.labels !== "undefined") && (reportInfo.labels !== null) && (reportInfo.labels.length !== 0)) ? 
                <Row className="pt-1 pb-1">
                    <Col md={6} className="text-left"><span className="text-muted">набор терминов, используемых для описания данного объекта</span>:</Col>
                    <Col md={6} className="text-center">{reportInfo.labels.map((item, key) => {
                        return <span key={`span_labels_${key}`}><Chip variant="outlined" size="small" label={item} key={`labels_${key}`}/>&nbsp;</span>;
                    })}</Col>
                </Row> : ""}
            <Row>
                <Col md={6} className="text-left"><span className="text-muted">определены ли данные содержащиеся в объекте</span>:</Col>
                <Col md={6} className="text-center">{(reportInfo.defanged) ? <span className="text-success"><i>ДА</i></span> : <span className="text-danger"><i>НЕТ</i></span>}</Col>
            </Row>
            {/* внешние ссылки не относящиеся к STIX информации }
            /*{getExternalReferences()}
            {((typeof reportInfo.object_marking_refs !== "undefined") && (reportInfo.object_marking_refs !== null) && (reportInfo.object_marking_refs.length !== 0)) ? 
                <Row>
                    <Col md={6} className="text-left"><span className="text-muted">ссылки на дополнительные метки</span>:</Col>
                    <Col md={6} className="text-center">{reportInfo.object_marking_refs.map((item, key) => {
                        return <li key={`marking_ref_${key}`}>{item}</li>;
                    })}</Col>
                </Row> : ""}
            {/* список "гранулярных меток" }
            {getGranularMarkings()}
            {/* список дополнительной информации }
            /{getExtensions()}
        </React.Fragment>);
    }
}*/

export default function ShowCommonPropertiesDomainObjectSTIX(props) {
    let { reportInfo } = props;

    let getExternalReferences = () => {
        // *** для теста START ***
        let lister = [
            {
                source_name: "external references 1",
                description: "common description external references 1 to read people",
                url: "html://external-references-example-1.net/watch?v=BSoHDCWze7E",
                hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                external_id: "ex-ref--vueueuf8egfurggrg7gd7fe",
            },
            {
                source_name: "external references 2",
                description: "common description external references 2 to read people",
                url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                hashes: {"md5": "dvyw7f37fggug8fg88g84fg8877e7fe", "sha128": "nbeiuu37fg7g4f7g84g8gd8fg8eg8egf8e", "sha256": "bcu48gc7g7848f48g88g85g8rfgh8rh84h8h8r8rh8rh8r"},
                external_id: "ex-ref--beg77e7fd3f377gr7eg7efg7",
            },
            {
                source_name: "external references 3",
                url: "html://external-references-example-2222.net/watch?v=BSoHDCWze7E",
                external_id: "ex-ref--cbscvsvcvdvucvduvduvcduvbduv",
            },
        ];
        reportInfo.external_references = lister;
        // *** для теста END ***

        if((typeof reportInfo.external_references === "undefined") || (reportInfo.external_references === null) || (reportInfo.external_references.length === 0)){
            return;
        }

        let externalReferences = () => {
            return reportInfo.external_references.map((item, key) => {
                let listHashes = [];

                if((item.hashes !== null) && (typeof item.hashes !== "undefined")){
                    for(let k in item.hashes){
                        listHashes.push(<li key={`hash_${item.hashes[k]}`}>{k}: {item.hashes[k]}</li>);
                    }    
                }

                return (<Grid container direction="row" className="mb-2" key={`key_external_references_${key}`}>
                    <Grid item md={12}>
                        <CreateExternalReferencesCard item={item} listHashes={listHashes}/>
                    </Grid>
                </Grid>);
            });
        };

        return (<Grid container direction="row">
            <Grid item md={4}><span className="text-muted">дополнительные, внешние ссылки</span>:</Grid>
            <Grid item md={8}>{externalReferences()}</Grid>
        </Grid>);
    };
    let getGranularMarkings = () => {
        // *** для теста START ***
        let lister = [
            {
                lang: "CH",
                marking_ref: "marking--bubdu8eeugfuegfe8fefhefe",
                selectors: ["selectors_suvnid_1", "selectors_cvbi_2"],
            },
            {
                lang: "US",
                marking_ref: "marking-- cscusuudbsfubdufbudbfueubue",
            },
            {
                lang: "RU",
                selectors: ["selectors-bdufbdubudfud", "selectors-sufuwu3fueuef", "selectors-dufveufueufuefu"],
            },
        ];
        reportInfo.granular_markings = lister;
        // *** для теста END ***

        if((typeof reportInfo.granular_markings === "undefined") || (reportInfo.granular_markings === null) || (reportInfo.granular_markings.length === 0)){
            return;
        }

        let granularMarkings = () => {
            return reportInfo.granular_markings.map((item, key) => {
                let listSelectors = [];

                if((item.selectors !== null) && (typeof item.selectors !== "undefined")){
                    for(let k in item.selectors){
                        listSelectors.push(<li key={`hash_${item.selectors[k]}`}>{k}: {item.selectors[k]}</li>);
                    }    
                }

                return (<Grid container direction="row" className="mb-2" key={`key_granular_mark_${key}`}>
                    <Grid item md={12}>
                        <CreateGranularMarkings item={item} listSelectors={listSelectors}/>
                    </Grid>
                </Grid>);
            });
        };

        return (<Grid container direction="row">
            <Grid item md={4}><span className="text-muted">дополнительные, {"\"гранулярные метки\""}</span>:</Grid>
            <Grid item md={8}>{granularMarkings()}</Grid>
        </Grid>);
    };
    let getExtensions = () => {
        reportInfo.extensions = { "test element": "budbuufbduf fndufbud ufbdgufgur", "test element 1": "bvbibevi484negfgrgiurg" };

        if((typeof reportInfo.extensions === "undefined") && (reportInfo.extensions === null) && (reportInfo.extensions.length === 0)){
            return;
        }   

        let  listExtensions = [];
        for(let k in reportInfo.extensions){
            listExtensions.push(<li key={`extensions_${k}`}>{k} - {reportInfo.extensions[k]}</li>);
        }

        return (<Grid container direction="row">
            <Grid item md={4}><span className="text-muted">любая дополнительная информация</span>:</Grid>
            <Grid item md={8}><ul>{listExtensions}</ul></Grid>
        </Grid>);
    };

    return (<Grid container>
        <Grid container direction="row">
            <Grid item md={6}><span className="text-muted">версия спецификации STIX</span>:</Grid>
            <Grid item md={6}>{(reportInfo.spec_version.length === 0) ? <span className="text-dark">версия не определена</span> : <i>{reportInfo.spec_version}</i>}</Grid>
        </Grid>

        {((typeof reportInfo.lang !== "undefined") && (reportInfo.lang !== null) && (reportInfo.lang.length !== 0)) ? 
            <Grid container direction="row">
                <Grid item md={6}><span className="text-muted">текстовый код языка</span>:</Grid>
                <Grid item md={6}><i>{reportInfo.lang.toUpperCase()}</i></Grid>
            </Grid> : ""}

        <Grid container direction="row">
            <Grid item md={6}><span className="text-muted">уверенность создателя в правильности своих данных от 0 до 100</span>&sup1;:</Grid>
            <Grid item md={6}><i>{reportInfo.confidence}</i></Grid>
        </Grid>

        {((typeof reportInfo.created_by_ref !== "undefined") && (reportInfo.created_by_ref !== null) && (reportInfo.created_by_ref.length !== 0)) ? 
            <Grid container direction="row">
                <Grid item md={6}><span className="text-muted">идентификатор источника создавшего доклад</span>:</Grid>
                <Grid item md={6}><i>{reportInfo.created_by_ref}</i></Grid>
            </Grid> : ""}

        {((typeof reportInfo.labels !== "undefined") && (reportInfo.labels !== null) && (reportInfo.labels.length !== 0)) ? 
            <Grid container direction="row">
                <Grid item md={6}><span className="text-muted">набор терминов, используемых для описания данного объекта</span>:</Grid>
                <Grid item md={6}>{reportInfo.labels.map((item, key) => {
                    return <span key={`span_labels_${key}`}><Chip variant="outlined" size="small" label={item} key={`labels_${key}`}/>&nbsp;</span>;
                })}</Grid>
            </Grid> : ""}

        <Grid container direction="row">
            <Grid item md={6}><span className="text-muted">определены ли данные содержащиеся в объекте</span>:</Grid>
            <Grid item md={6}>{(reportInfo.defanged) ? <span className="text-success"><i>ДА</i></span> : <span className="text-danger"><i>НЕТ</i></span>}</Grid>
        </Grid>

        {/* внешние ссылки не относящиеся к STIX информации */}
        {getExternalReferences()}
        {((typeof reportInfo.object_marking_refs !== "undefined") && (reportInfo.object_marking_refs !== null) && (reportInfo.object_marking_refs.length !== 0)) ? 
            <Grid container direction="row">
                <Grid item md={6}><span className="text-muted">ссылки на дополнительные метки</span>:</Grid>
                <Grid item md={6}>{reportInfo.object_marking_refs.map((item, key) => {
                    return <li key={`marking_ref_${key}`}>{item}</li>;
                })}</Grid>
            </Grid> : ""}

        {/* список "гранулярных меток" */}
        {getGranularMarkings()}
            
        {/* список дополнительной информации */}
        {getExtensions()}
    </Grid>);
}

ShowCommonPropertiesDomainObjectSTIX.propTypes = {
    reportInfo: PropTypes.object.isRequired,
}; 

function CreateExternalReferencesCard(props){
    const classes = useStyles();
    let { item, listHashes } = props;
    let sourceName = "",
        externalId = "";

    if((typeof item.source_name !== "undefined") && (item.source_name !== null) && (item.source_name.length !== 0)){
        sourceName = item.source_name;
    }

    if((typeof item.external_id !== "undefined") && (item.external_id !== null) && (item.external_id.length !== 0)){
        externalId = item.external_id;
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <CardHeader title={sourceName} subheader={`ID:${externalId}`} />
                {((typeof item.description === "undefined") || (item.description === null) || (item.description.length === 0) ? 
                    "": 
                    <Typography variant="body2" component="p"><span className="text-muted">описание</span>: {item.description}</Typography>)}
                {((typeof item.url === "undefined") ||  (item.url === null) || (item.url.length === 0) ? 
                    "": 
                    <Typography variant="body2" component="p"><span className="text-muted">url</span>: <a href={item.url}>{item.url}</a></Typography>)}
                {(listHashes.length !== 0) ? <span><span className="text-muted">хеш суммы</span>:<ol>{listHashes}</ol></span> : ""}
            </CardContent>
        </Card>
    );
}

CreateExternalReferencesCard.propTypes = {
    item: PropTypes.object.isRequired,
    listHashes: PropTypes.array.isRequired,
};

function CreateGranularMarkings(props){
    const classes = useStyles();
    let { item, listSelectors } = props;
    let markingRef = "";

    if((typeof item.marking_ref !== "undefined") && (item.marking_ref !== null) && (item.marking_ref.length !== 0)){
        markingRef = item.marking_ref;
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <CardHeader title={markingRef} />
                {((typeof item.lang === "undefined") || (item.lang === null) || (item.lang.length === 0) ? 
                    "": 
                    <Typography variant="body2" component="p"><span className="text-muted">текстовый код языка</span>: {item.lang}</Typography>)}
                {(listSelectors.length !== 0) ? <span><span className="text-muted">хеш суммы</span>:<ol>{listSelectors}</ol></span> : ""}
            </CardContent>
        </Card>
    );
}

CreateGranularMarkings.propTypes = {
    item: PropTypes.object.isRequired,
    listSelectors: PropTypes.array.isRequired,
};