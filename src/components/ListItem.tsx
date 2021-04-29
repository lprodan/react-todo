import React from 'react';
import { Item } from "../services/list.service";

interface State {
    text: string;
    editing: boolean;
}

interface Props {
    item: Item;
    onCheck?: () => void;
    onEdit?: (text: string) => void;
    onDelete?: () => void;
}

export class ListItem extends React.Component<Props, State> {
    private get text(): string {
        return this.state.text;
    }

    private set text(text: string) {
        this.setState({text});
    }

    constructor(props: Readonly<Props> | Props) {
        super(props);

        this.state = {
            text: '',
            editing: false
        }
    }

    render(): React.ReactNode {
        const { editing } = this.state;
        const { item, onCheck, onDelete } = this.props;
        const classList = ['item'];

        if (editing) {
            classList.push('editing');
        }

        if (item.done) {
            classList.push('done');
        }

        return (
            <li className={classList.join(' ')}>
                <label className="container">
                    {editing
                        ? <input className="input-edit" type="text" value={this.text} onChange={e => this.text = e.target.value} />
                        : <span className="text">{item.text}</span>
                    }
                    <span className="checkmark" onClick={() => onCheck?.()} />
                </label>
                {editing
                    ? <i className="icon-edit fas fa-check" onClick={() => this.leaveEditMode()} />
                    : <i className="icon-edit far fa-edit" onClick={() => this.enterEditMode()} />
                }
                {editing || <i className="fas fa-times icon-close" onClick={() => onDelete?.()} />}
            </li>
        );
    }

    private enterEditMode(): void {
        this.text = this.props.item.text;
        this.setState({editing: true});
    }

    private leaveEditMode(): void {
        if (this.text !== this.props.item.text) {
            this.props.onEdit?.(this.text);
        }

        this.setState({editing: false});
    }
}