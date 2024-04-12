import {FormControl, ValidationErrors} from "@angular/forms";

export class WitheSpaceValidator {

    static notOnlyWithespace(control: FormControl) : ValidationErrors | null {
        if(control.value != null && control.value.trim().length == 0) {
            return { 'notOnlyWithespace' : true };
        } else {
            return null;
        }
    }
}
