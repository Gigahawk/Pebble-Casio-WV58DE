from tabulate import tabulate

headers = ["Property", "Type", "Description"]

maxcoltotal = 69
maxcolwidths = [12, 10, 47]
if sum(maxcolwidths) > maxcoltotal:
    raise ValueError("Total column width must be below 69")

table = [
    ["type", "string", "Set to `itemizedSlider`"],
    ["id", "string (unique)", "REQUIRED: you must assign a unique ID for the options to get picked up properly. Set this to a unique string to allow this item to be looked up using `Clay.getItemById()` in your custom function."],
    ["messageKey", "string (unique)", "The AppMessage key matching the messageKey item defined in your package.json. Set this to a unique string to allow this item to be looked up using `Clay.getItemsByMessageKey()` in your custom function. You must set this if you wish for the value of this item to be persisted after the user closes the config page."],
    ["label", "string", "The label that should appear next to this item."],
    ["defaultValue", "int", "The default index of the slider"],
    ["description", "string", "Optional sub-text to include below the component"],
    ["options", "array of strings", "The options you want to appear in the text box"],
    ["capabilities", "array" , "Array of features that the connected watch must have for this item to be present"],
    ["group", "string", "Set this to allow this item, along with other items sharing the same group to be looked up using `Clay.getItemsByGroup()` in your custom function"]

]

print(tabulate(table, headers, tablefmt="grid", maxcolwidths=maxcolwidths))