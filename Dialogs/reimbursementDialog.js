const {
  ComponentDialog,
  WaterfallDialog,
  TextPrompt,
  Dialog,
  ConfirmPrompt,
  ChoicePrompt,
  ChoiceFactory,
  NumberPrompt,
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { reimbursementDialog } = require("../Constants/DialogIds");
// const { detailsCard, user1, user2 } = require("../cards/card");
const { HelpDialog } = require("./helpDialog");
const reimbursementDialogWF1 = "reimbursementDialogWF1";
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog");

const TextPromptDialog = "TextPromptDialog";
const ChoicePromptDialog = "ChoicePromptDialog";
const NumberPromptDialog = "NumberPromptDialog";
const ConfirmPromptDialog = "ConfirmPromptDialog";

class ReimbursementDialog extends CancelAndHelpDialog {
  constructor(conversationState) {
    super(reimbursementDialog);

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;
    this.reimbursementStateAccessor =
      this.conversationState.createProperty("reimbursementState");
    this.addDialog(new HelpDialog(conversationState));

    this.addDialog(new TextPrompt(TextPromptDialog));
    this.addDialog(new ChoicePrompt(ChoicePromptDialog));
    this.addDialog(new NumberPrompt(NumberPromptDialog));
    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));

    this.addDialog(
      new WaterfallDialog(reimbursementDialogWF1, [
        this.preprocessEntities.bind(this),
        // this.empDetails.bind(this),
        // this.checkDetails.bind(this),
        this.reimbursementType.bind(this),
        this.askAmount.bind(this),
        this.confirmReimbursement.bind(this),
        this.endDialog1.bind(this),
      ])
    );

    this.initialDialogId = reimbursementDialogWF1;
  }
  //  -------------------preprocessing entities------------------
  async preprocessEntities(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {
        console.log(stepContext.options.entities);

        // let nameEntity = stepContext.options.entities.personName
        //   ? stepContext.options.entities.personName[0]
        //   : null;
        // let empIdEntity = stepContext.options.entities.number
        //   ? stepContext.options.entities.number[0]
        //   : null;
        let reimbursementTypeEntity = stepContext.options.entities
          .ReimbursementType
          ? stepContext.options.entities.ReimbursementType[0][0]
          : null;
        let amountEntity = stepContext.options.entities.money
          ? stepContext.options.entities.money[0].number
          : null;
        let unitsEntity = stepContext.options.entities.money
          ? stepContext.options.entities.money[0].units
          : null;

        stepContext.values.Entities = {
          // nameEntity,
          // empIdEntity,
          reimbursementTypeEntity,
          amountEntity,
          unitsEntity,
        };
        return stepContext.next();
      }
    } catch {
      console.log(error);
    }
  }
  // --------------------------------------------------------------
  // async empDetails(stepContext) {
  //   console.log(stepContext.values.Entities);
  //   try {
  //     if (
  //       (!stepContext.values.Entities.nameEntity &&
  //         stepContext.values.Entities.nameEntity == null) ||
  //       (!stepContext.values.Entities.empIdEntity &&
  //         stepContext.values.Entities.empIdEntity == null)
  //     ) {
  //       if (stepContext.options && stepContext.options.formRefill) {
  //         return stepContext.next();
  //       } else {
  //         await stepContext.context.sendActivity(
  //           "To reimburse you need to fill the following details :"
  //         );
  //         await stepContext.context.sendActivity({
  //           attachments: [CardFactory.adaptiveCard(detailsCard())],
  //         });
  //         return Dialog.EndOfTurn;
  //       }
  //     } else {
  //       return await stepContext.next();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // async checkDetails(stepContext) {
  //   try {
  //     let dialogData = await this.reimbursementStateAccessor.get(
  //       stepContext.context,
  //       {}
  //     );
  //     let userDetails = stepContext.context.activity.value;
  //     if (
  //       stepContext.values.Entities.nameEntity &&
  //       stepContext.values.Entities.nameEntity != null &&
  //       stepContext.values.Entities.empIdEntity &&
  //       stepContext.values.Entities.empIdEntity != null
  //     ) {
  //       dialogData.empID = stepContext.values.Entities.empIdEntity;
  //       dialogData.empName = stepContext.values.Entities.nameEntity;
  //     } else {
  //       dialogData.empID = userDetails.empID;
  //       dialogData.empName = userDetails.empName;
  //     }

  //     if (
  //       (user1.empName === dialogData.empName &&
  //         user1.empID === parseInt(dialogData.empID)) ||
  //       (user2.empName === dialogData.empName &&
  //         user2.empID === parseInt(dialogData.empID))
  //     ) {
  //       await stepContext.context.sendActivity(
  //         `Found employee number : ${dialogData.empID} `
  //       );
  //       return stepContext.next();
  //     } else {
  //       await stepContext.context.sendActivity(
  //         "Please enter valid employee details!"
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async reimbursementType(stepContext) {
    try {
      // console.log(" reimbursement type index -> ", stepContext.index);
      if (
        !stepContext.values.Entities.reimbursementTypeEntity &&
        stepContext.values.Entities.reimbursementTypeEntity == null
      ) {
        return await stepContext.prompt(ChoicePromptDialog, {
          prompt:
            "Please choose the event for which you are applying this reimbursement.",
          choices: ChoiceFactory.toChoices(["Travel", "Medical", "Convence"]),
          retryPrompt: "Please choose event from the provided options: ",
        });
      } else {
        return await stepContext.next();
      }
    } catch {
      console.log(error);
    }
  }
  async askAmount(stepContext) {
    if (
      stepContext.values.Entities.reimbursementTypeEntity &&
      stepContext.values.Entities.reimbursementTypeEntity != null
    ) {
      stepContext.values.reimbursementType =
        stepContext.values.Entities.reimbursementTypeEntity;
    } else {
      stepContext.values.reimbursementType = stepContext.result.value;
    }
    if (
      !stepContext.values.Entities.amountEntity &&
      stepContext.values.Entities.amountEntity == null
    ) {
      return await stepContext.prompt(NumberPromptDialog, {
        prompt: `To Reimburse your ${stepContext.values.reimbursementType} allowance please enter Reimbursement Amount : `,
        retryPrompt: "Please enter a valid amount:",
      });
    } else {
      return await stepContext.next();
    }
  }

  async confirmReimbursement(stepContext) {
    if (
      stepContext.values.Entities.amountEntity &&
      stepContext.values.Entities.amountEntity != null
    ) {
      stepContext.values.amount = stepContext.values.Entities.amountEntity;
      stepContext.values.units = stepContext.values.Entities.unitsEntity;
      await stepContext.context.sendActivity(
        `Ok, I have all I need. I will file your request for ${stepContext.values.amount} ${stepContext.values.units}s for ${stepContext.values.reimbursementType} allowance. `
      );
    } else {
      stepContext.values.amount = stepContext.result;
      await stepContext.context.sendActivity(
        `Ok, I have all I need. I will file your request for amount $${stepContext.values.amount} for ${stepContext.values.reimbursementType} reimbursement. `
      );
    }
    // console.log(
    //   "stepContext.options.interrupt -> ",
    //   stepContext.options.interrupt
    // );
    if (stepContext.options.interrupt === true) {
      await stepContext.prompt(ConfirmPromptDialog, {
        prompt: "Do you want to continue where you left? ",
      });
    } else {
      await stepContext.prompt(ChoicePromptDialog, {
        prompt:
          "Do you need help with anything else? Choose 'Yes' to see the suggestions : ",
        choices: ChoiceFactory.toChoices(["Yes", "No"]),
      });
      return await stepContext.endDialog();
    }
  }
  async endDialog1(stepContext) {
    return await stepContext.endDialog();
  }
}

module.exports.ReimbursementDialog = ReimbursementDialog;
