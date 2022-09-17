# Tour of the website

When the website first opens, claims are retrieved from the backend and displayed in the claims list.

![claims-list](https://user-images.githubusercontent.com/39875052/190860509-f178e852-9292-4eb5-874f-b1a4c7fdd097.PNG)

The user can then filter the claims by entering one or a combination of filter criteria and then clicking the Filter button.

![filtered-claims](https://user-images.githubusercontent.com/39875052/190860549-46f4b8fc-235c-4cda-a50b-fc5c6949405a.png)

The user can then click on a claim number to navigate to the details of the claim.

![claim-details](https://user-images.githubusercontent.com/39875052/190860586-94c74368-0f7e-4fd1-bb1b-78a19cb4404a.png)

To process the claim, the user clicks on a line item code to open the item details drawer. Here, the user can enter the approved quantity which automatically calculates and fills the other fields in the approved column. Entering an invalid value (ex: greater than requested quantity) results in displaying an error message and disabling the Save button.

![invalid-item-detail](https://user-images.githubusercontent.com/39875052/190860739-1bc656da-6215-493c-9909-91b32fe10be2.png)

Once the user enters a valid approved quantity, they're allowed to save their changes.

![valid-item-detail](https://user-images.githubusercontent.com/39875052/190860783-d5ab9f97-60a0-4176-8d50-fbcf5fe90189.png)

While processing a claim, the user can navigate between the different line items by clicking on the previous and next button at the top-left side of the drawer. In case the user enters a value and then attempts to close the drawer or navigate to another line item, they are prompted to save their changes first.

![prompt](https://user-images.githubusercontent.com/39875052/190860850-5dc39773-5e6d-4271-83c9-9d0f56661987.png)

While the claim is pending, the user can do any modifications and save their changes at any time (no validation). However, if a user attempts to Submit the claim without processing all of the line items, an error alert message is displayed.

![submit-validation](https://user-images.githubusercontent.com/39875052/190861017-e127173c-ace1-49ea-a68c-64ea9ecc64a0.png)

Once all line items are processed, the user can submit the claim which will prompt the user to confirm their decision. Once the user confirms, the Total Approved is calculated, the Date Processed is set to today, and the claim Status is computed. Finally, a success alert message is displayed the user and no more actions can be done to the claim (Save and Submit buttons are hidden).

![confirmed](https://user-images.githubusercontent.com/39875052/190861264-2fb3f915-2c81-4a48-b94e-f9f78b4143e7.png)

