import { useRouter, NextRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {Modal, Row, Col, Avatar, Table, Tag} from 'antd';
import 'antd/dist/antd.css';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { addr: '' } }, { params: { addr: '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f' } }, { params: { addr: '0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7' } }],
    fallback: false, // fallback is set to false because we already know the slugs ahead of time
  };
};

export const getStaticProps = async ({ params }) => {
  // const transactiondetails = await fetch('0x1234' + params.addr).then((r) => r.json());
  const res = await fetch('https://api.orgboard.finance:2053/gnosis/recurring/' + params.addr).then((res) => res.json());
  console.log(res)
  return {
    props: {res: res},
  };
};

const Gnosis = ({ res }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMore, setViewMore] = useState(false);

  const columns = [
    {
      title: 'Execution Time',
      dataIndex: 'executionDate',
      key: 'executionDate',
      sorter: (a, b) => new Date(a.executionDate) - new Date(b.executionDate),
      render: (_, {executionDate}) => (
        <>
          <p>
            {executionDate.slice(11,19) + " " + executionDate.slice(0,10)}
          </p>
        </>
      ),
    },
    {
      title: 'Activity',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'SENT',
          value: 'sent',
        },
        {
          text: 'RECIEVE',
          value: 'recieve',
        },
      ],
    },
    {
      title: 'Interacted Address',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Address Type',
      dataIndex: 'addresstype',
      key: 'addresstype',
      render: (_, { addresstype }) => (
        <>
          <Avatar.Group maxCount={1}
            maxStyle={{
              color: "#fa5036",
              backgroundColor: "#fde3cf"
            }}
          >
            {[...Array(3)].map((e, i) => 
              <Avatar 
                style={{
                  backgroundColor: '#fa5036',
                }}
                icon={<UserOutlined />}
                onClick={() => showModal(addresstype)} 
                shape="circle" type="primary"
              />
            )}
          </Avatar.Group>
        </>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'usdValue',
      key: 'usdValue',
      render: (_, { usdValue, tokenSymbol, amount}) => (
        <>
          <p>
            <NumberFormat displayType={'text'} value={amount} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/>
            {" " + tokenSymbol + "\n≈ $"}
            <NumberFormat displayType={'text'} value={usdValue} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/>
          </p>
        </>
      ),
      sorter: (a, b) => a.usdValue-b.usdValue,
    },
    {
      title: 'Recurring',
      key: 'recurringMonths',
      dataIndex: 'recurringMonths',
      render: (_, { recurringMonths }) => (
        <>
          <Tag color={recurringMonths === 1 ? "volcano": recurringMonths < 6 ? "geekblue" : "green"}>
            {recurringMonths === 1 ? "never interacted before this month"
            : 
            recurringMonths < 6 ? "interacted monthly for "+recurringMonths+" months" 
            :
             "interacted monthly over 6 months"}
          </Tag>
        </>
      ),
    },
    {
      title: 'Tornado Cash Flag',
      dataIndex: 'flag',
      key: 'flag',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'reamark',
    },
  ];

  const columns2 = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Total Interactions',
      dataIndex: 'interactions',
      key: 'interactions',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  const data2 = [
    {
      rank: 1,
      address: "0x4bb4c1B0745ef7B4642fEECcd0740deC417ca0a2",
      interactions: 3321,
      remark: "Salary"
    },
    {
      rank: 2,
      address: "0xb2701351a2c1c6E30BFA2699d25f85a5100e39D3",
      interactions: 3123,
      remark: "N/A"
    },
    {
      rank: 3,
      address: "0xFBb3a85603C398Ff22435DD40873EC190134e1f6",
      interactions: 3013,
      remark: "Donation"
    }
  ]

  const currModalInfo = {
    length: 3,
    required: 3,
    signerList: 
    [
      {
        owner: "0x4bb4c1B0745ef7B4642fEECcd0740deC417ca0a2",
        submissionDate: "2022-07-20T14:28:56.486394Z",
        signature: "0x01dc1e1da8f58c5ffb4363d53692543256e09ea625e54064e3e62187fc343a560ec3b4714cd0396d9b6c4d285f6917549253d400c6f46baa6e4f2765620f94de1c",
        signatureType: "EOA",
      },
      {
        owner: "0xb2701351a2c1c6E30BFA2699d25f85a5100e39D3",
        submissionDate: "2022-07-20T14:32:01.479106Z",
        signature: "0xa00edc916fb22d5f53f8b2c6486d4ca50bee21859428f9996b474602cf689e8523916a0345e0ac22b3d33046a303f62070df028f18ca344737ce6768f78d12f61c",
        signatureType: "EOA",
      },
      {
        owner: "0xFBb3a85603C398Ff22435DD40873EC190134e1f6",
        submissionDate: "2022-07-21T07:23:19.614148Z",
        signature: "0xea74fef88a42e6a80d74c9fc6834b4aa1fa34a61c564d6f4e2c816bb3f02714623a2d16337b84719bb5af049e386e7bdf1505e5757ba7bbd766eeef664db94391c",
        signatureType: "EOA",
      },
    ],
  }
  const showModal = (e) => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const StyledTable = styled(Table)`
    .ant-table-thead > tr > th{
      color: #fa5036;
    }
  `;

  return (
    <div key={res.id} style={{backgroundColor: "#fff7f8", padding: "40px"}}>
      <h2 style={{fontSize: "20px"}}>Top Interacted Addresses</h2>
      <StyledTable pagination={false} columns={columns2} dataSource={data2}/>
      <h2 style={{fontSize: "20px", paddingTop: "30px"}}>Transaction History</h2>
      <StyledTable columns={columns} dataSource={res}/>
      <Modal 
        title={currModalInfo.length+" Signers "+currModalInfo.required+" Required"} 
        visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={800}
      >
            {currModalInfo.signerList.map((item) => {
              return (
                <Row style={{paddingBlock: '25px'}} key={item.owner}>
                  <Col span={6} style={{textAlign: 'right', paddingRight: '30px'}}>
                    <Avatar size={64} icon={<UserOutlined />}/>
                  </Col>
                  <Col span={18}>
                    <div>
                      <p>Owner: {item.owner}</p>
                      <p>Time: {item.submissionDate.slice(11, 19)}</p>
                      <p>Date: {item.submissionDate.slice(0, 10)}</p>
                      <p>
                        Signature: {viewMore ? item.signature:item.signature.slice(0,40)+"..."}
                        <a onClick={()=>setViewMore(true)}>{viewMore ? "":"view more"}</a>
                      </p>
                      <p>Signature Type: {item.signatureType}</p>
                    </div>
                  </Col>
                </Row>
              );
            })}
      </Modal>
    </div>
  );
};

export default Gnosis;