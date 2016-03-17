modal_objects = {

        //Don't change
        elements:{
            //Locators

        modalHeader: function(){

            return element(by.css('.modal-header'));

        },
         modalBody: function(){

            return element(by.css('.modal-body'));

        },
        okButton: function(){

            return element(by.css('button[type="submit"]'));

        },

    },//End of locators. Locators need to go before this

        //Functions can go below
     getmodalHeaderText: function(){

        return this.elements.modalHeader().getText();

    },
     getmodalBodyText: function(){

        return this.elements.modalBody().getText();

    },
    
    //LAST ONE
    clickOkButton: function(index){

        return this.elements.okButton().click();

    }
};


module.exports = modal_objects;