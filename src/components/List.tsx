import React from 'react';
import ListService, { Item } from '../services/local-list.service';
import { ListItem } from "./ListItem";

interface Filter {
    done?: boolean;
    label: string;
}

interface State {
    items: Item[];
    text: string;
    done?: boolean;
}

interface Props {
}

export class List extends React.Component<Props, State> {
    private get text(): string {
        return this.state.text;
    }

    private set text(value: string) {
        this.setState({
            text: value
        });
    }

    private readonly filters: Filter[] = [{
        label: 'All'
    }, {
        label: 'made',
        done: true
    }, {
        label: 'todo',
        done: false
    }]


    constructor(props: Props) {
        super(props);
        this.state = {
            items: [],
            text: '',
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount(): void {
        this.fetchData();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevState.done !== this.state.done) {
            this.fetchData();
        }
    }

    render(): React.ReactNode {
        const { items } = this.state;

        return (
            <React.Fragment>
                <div className="box-header">
                    <input className="input" type="text" placeholder="Your tasks.." autoFocus
                           onKeyDown={e => e.code === 'Enter' && this.enter(this.text)}
                           value={this.text}
                           onChange={e => this.text = (e.target as HTMLInputElement).value}/>
                </div>
                <div className="box-section">
                    <ul className="ul">
                        {items.map(item => <ListItem key={item.id} item={item}
                                                     onCheck={() => this.checkItem(item)}
                                                     onDelete={() => this.deleteItem(item.id)}
                                                     onEdit={text => this.editItem(item.id, text)}
                        />)}
                    </ul>
                </div>
                <div className="box-footer">
                    {this.filters.map((filter, index) =>
                        <div key={index} className={'condition' + (this.state.done === filter.done ? ' active' : '')} onClick={() => this.setState({done: filter.done})}>
                            {filter.label}
                        </div>)}
                </div>
            </React.Fragment>
        );
    }

    private fetchData(): void {
        ListService.all(this.state?.done).then(items => this.setState({items}));
    }

    private checkItem(item: Item): void {
        ListService.edit(item.id, {done: !item.done})
            .then(this.fetchData);
    }

    private editItem(id: number, text: string) {
        ListService.edit(id, {text})
            .then(this.fetchData);
    }

    private createItem(text: string) {
        ListService.create(text)
            .then(this.fetchData)
            .then(() => this.setState({text: ''}));
    }

    private deleteItem(id: number) {
        if (window.confirm('Are you sure?')) {
            ListService.delete(id).then(this.fetchData);
        }
    }

    private enter(text: string): void {
        text = text.trim();

        if (text) {
            this.createItem(text);
        }
    }
}