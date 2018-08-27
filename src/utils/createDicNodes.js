import {Select, Radio, Checkbox } from 'antd'

const RadioButton = Radio.Button
const SelectOption = Select.Option

const createDicNodes = {
	createRadio: ( {list=[], disabled=false} ) => {
		return list.map((item) => <Radio disabled={disabled} value={item.code} key={item.code}>{item.name}</Radio>)
	},
	createRadioButton: ( {list=[], disabled=false} ) => {
		return list.map((item) => <RadioButton disabled={disabled} value={item.code} key={item.code}>{item.name}</RadioButton>)
	},
	createSelectOption: ( {list=[], disabled=false} ) => {
		return list.map((item) => <SelectOption disabled={disabled} value={item.code} key={item.code}>{item.name}</SelectOption>)
	},
	createCheckbox: ( {list=[], disabled=false} ) => {
		return list.map((item) => <Checkbox disabled={disabled} value={item.code} key={item.code}>{item.name}</Checkbox>)
	}
}

export default createDicNodes 