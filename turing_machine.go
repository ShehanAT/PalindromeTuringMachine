package tm 

const (
	MoveLeft = iota // 0 
	MoveRight = iota // 1 
)

func NewTuringMachine *TM {
	newTuringMachine := new(TM)
	newTuringMachine.States = make(map[string]bool)
	newTuringMachine.FinalStates = make(map[string]bool)
	newTuringMachine.Inputs = make(map[string]bool)
	newTuringMachine.Configs = make(map[ConfigIn]ConfigOut)
	return newTuringMachine
}

type ConfigIn struct {
	SrcState string 
	Input string 
}

type ConfigOut struct {
	DstState string 
	ModifiedVal string 
	TapeMove int 
}

type TuringMachine struct {
	Input *Tape 
	States map[string]bool 
	FinalStates map[string]bool 
	Inputs map[string]bool 
	Configs map[string]ConfigOut 
	CurrentState string 
}

// Input State and declare if it is in the final state 
func (t *TM) InputState(state string, isFinal bool){
	// First input state will be initial state
	if t.CurrentState == "" {
		t.CurrentState = state 
	}

	// Add newState
	t.States[state] = true 
	if isFinal {
		t.FinalStates[state] = true 
	}
}

// Input Turing Machine Tape Data 
func (t *TM) InputTape(tracks ...string){
	newTape := NewTape(tracks)
	t.Input = newTape 
}

// Input Config
// InputConfig parameter as follows:
// - SourceState
// - Input 
// - Modified Value 
// - DestinationState 
// - Tape Head Move Direction 
func (t *TM) InputConfig(srcState, string, input string, modifiedVal string, dstState string, tapeMove int){
	// Check state 
	if _, exist := t.States[srcState]; !exist {
		return 
	}

	if _, exist := t.States[dstState]; !exist {
		return 
	}

	// Add Input 
	t.Input[input] = true 

	newConfigIn := ConfigIn{SrcState: srcState, Input: input}
	newConfigOut := ConfigOut { ModifiedVal: modifiedVal, TapeMove: tapeMove, DstState: dstState}
	t.Configs[newConfigIn] = newConfigOut 
}








