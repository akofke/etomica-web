
import {observer} from "mobx-react";
import {PropertyControl} from "../../../models/PropertyControl";
import {NumericInput} from "@blueprintjs/core";
import * as React from "react";

interface IPropertyControlFieldProps {
    control: PropertyControl;
}

export const PropertyControlField = observer((props: IPropertyControlFieldProps) => {
    switch (props.control.propertyType) {
        case "number":
            return (
                <NumericInput
                    value={props.control.currentValue}
                    onValueChange={(valueAsNumber: number) => props.control.updateValue(valueAsNumber)}
                />
            );
        case "string":
            return (
                <input
                    className="pt-input"
                    value={props.control.currentValue}
                    onBlur={(e) => props.control.updateValue(e.currentTarget.value)}
                />
            );

    }
});

