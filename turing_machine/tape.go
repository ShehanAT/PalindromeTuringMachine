package turing_machine 

// import (
// 	"fmt" // stands for the Format package
// )

type Tape struct {
	Symbol []string 
	Head int 
}

func (t *Tape) moveLeft(){
	if t.Head > 0 {
		t.Head--
	}
}

func (t *Tape) moveRight(){
	t.Head++
}

// Run tape head move and modify value 
func (t *Tape) DoOption(modifiedSym string, directToRight bool){
	if t.Head >= len(t.Symbol){
		return 
	}

	t.Symbol[t.Head] = modifiedSym

	if directToRight {
		t.moveRight()
	}else{
		t.moveLeft()
	}
}

// Return if the tape is run to the end 
func (t *Tape) EndInput() bool {
	return t.Head == len(t.Symbol) // when head exceeds slice size, it is the end 
}

// Read one symbol from tape 
func (t *Tape) ReadSymbol() string {
	// fmt.Println("t.Head: ", t.Head, "t.Symbol: ", t.Symbol)
	return t.Symbol[t.Head]
}

func NewTape(Symbols []string) *Tape{
	newT := new(Tape)
	newT.Symbol = Symbols 
	return newT
}

