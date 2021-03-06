import React from "react";
import { Link } from "react-router-dom";

//Styling
import { Layout } from "antd";
import { Row, Col, Radio } from "antd";
import { PageHeader } from "antd";
import { Input, Button, Result } from "antd";
import { Form, InputNumber } from "antd";

import { storyContract, web3 } from "../utils/utils";

const { TextArea } = Input;

class PublisherMode extends React.Component {
  state = {
    author: "",
    submittedEntry: false
  };

  async componentDidMount() {
    await this.getAccountDetails();
  }

  async getAccountDetails() {
    const address = await web3.eth.getAccounts();
    this.setState({ author: address[0] });
  }

  handleSubmit = e => {
    e.preventDefault();

    const that = this;

    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err);

      if (!err) {
        console.log("VALUES", values);

        const {
          chapterTitle,
          content,
          question,
          bookTitle,
          stakedAmount,
          authorPreference
        } = values;

        const userAccount = this.state.author;

        storyContract.methods
          .createChapter(
            0,
            chapterTitle,
            content,
            question,
            authorPreference,
            bookTitle
          )
          .send({
            from: userAccount,
            value: web3.utils.toWei(stakedAmount.toString(), "ether")
          })
          .then(function(reciept) {
            console.log(reciept);
            that.setState({ submittedEntry: true });
          });
      }
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout style={{ padding: "24px 20px", background: "#fff" }}>
        {this.state.submittedEntry ? (
          <Result
            status="success"
            title="Successfully submitted your book to the blockchain!"
            subTitle="Strap in for the feedback!"
            extra={[
              <Link to={"/"}>
                <Button type="primary" key="console">
                  Read all member stories
                </Button>
              </Link>
            ]}
          />
        ) : (
          <>
            <Row>
              <Col span={24}>
                <PageHeader
                  onBack={() => this.goBack()}
                  title="enter the task under review!"
                />
              </Col>
            </Row>
            <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
              <Form.Item label="Enter tasks: ">
                {getFieldDecorator("bookTitle", {
                  rules: [
                    {
                      type: "string",
                      message: ""
                    },
                    {
                      required: true,
                      message: "Please input your book title!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Enter employees name ">
                {getFieldDecorator("chapterTitle", {
                  rules: [
                    {
                      type: "string",
                      message: ""
                    },
                    {
                      required: true,
                      message: "Please input employees name!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Enter tasks content: ">
                {getFieldDecorator("content", {
                  rules: [
                    {
                      type: "string",
                      message: ""
                    },
                    {
                      required: true,
                      message: "Please input tasks content!"
                    }
                  ]
                })(<TextArea rows={4} />)}
              </Form.Item>
              <Form.Item label="additional questions or data: ">
                {getFieldDecorator("question", {
                  rules: [
                    {
                      type: "string",
                      message: ""
                    },
                    {
                      required: false
                    }
                  ]
                })(
                  <Input
                    style={{ width: "50%", marginRight: 20 }}
                    placeholder="additional info"
                  />
                )}
              </Form.Item>

              <Form.Item label="enter eth amount to show quality of work">
                {getFieldDecorator("stakedAmount", {
                  initialValue: 3,
                  rules: [
                    {
                      required: true,
                      message:
                        "Please input some amount."
                    }
                  ]
                })(<InputNumber />)}
                <span className="ant-form-text"> ETH</span>
              </Form.Item>

              <Form.Item label="do you agree to the companie's guidelines for reviewing?">
                {getFieldDecorator("authorPreference")(
                  <Radio.Group>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                )}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  submit taskreview
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Layout>
    );
  }
}

const WrappedPublisherMode = Form.create({ name: "register" })(PublisherMode);

export default WrappedPublisherMode;
