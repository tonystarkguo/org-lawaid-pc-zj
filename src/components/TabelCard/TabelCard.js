import { Table } from 'antd';
import { getDataService, postDataService } from '../../services/commonService'

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  render: name => `${name.first} ${name.last}`,
  width: '20%',
}, {
  title: 'Gender',
  dataIndex: 'gender',
  filters: [
    { text: 'Male', value: 'male' },
    { text: 'Female', value: 'female' },
  ],
  width: '20%',
}, {
  title: 'Email',
  dataIndex: 'email',
}];

class App extends React.Component {
  constructor(props) {
    super(props)
    const columns =  props.columns
    const url = props.url
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      columns,
      url
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const dataSource = getDataService({url: config.api.getAllProvince}, {})
    dataSource.then((dataSource) => {
      if(dataSource.code === '1') {
        this.setState({
          loading: false,
          data: dataSource.list,
          pagination,
        });
      }
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'https://randomuser.me/api',
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then((data) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.results,
        pagination,
      });
    });
  }
  componentDidMount() {
    this.fetch();
  }
  render() {
    return (
      <Table columns={columns}
        rowKey={record => record.registered}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

ReactDOM.render(<App />, mountNode);