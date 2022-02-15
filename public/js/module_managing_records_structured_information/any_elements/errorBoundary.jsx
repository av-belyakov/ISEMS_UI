import React from "react";
import { Grid } from "@material-ui/core";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
  
    /*componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
        console.log("Error: ", error, " ERROR info: ", errorInfo);
    }*/
  
    render() {
        if (this.state.hasError) {
            return (<Grid container direction="row">
                <Grid item container md={12} justifyContent="center">
                    <span className="pt-2 pb-3">Ошибка! Что то пошло не так.</span>
                </Grid>
            </Grid>);
        }
  
        return this.props.children; 
    }
}
  
ErrorBoundary.propTypes = {};