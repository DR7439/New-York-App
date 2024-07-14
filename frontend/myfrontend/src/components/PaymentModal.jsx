import React, { useState } from "react";
import {Row, Col, Form, Input, Modal,  Divider, Checkbox} from "antd";

export default function PaymentModal(props){
    return(<Modal
    centered= {props.centered}
    open = {props.open}
    onCancel = {props.onClose}
    creditAmount = {props.creditAmount}
    cost = {props.cost}
   >
     <Checkbox className="text-blue-600/100">Credit Card/Debit Card</Checkbox>
     <p className="ml-6 text-slate-300">Secure transfer using your bank account</p>
     <Divider/>
     <Form layout="vertical">
          <Row gutter={[8,24]}>
          <Col span={12}>
               <Form.Item
               label="Names(s)"
               name="names(s)"
               rules={[
                    {
                      required: true,
                      message: 'Please enter your names(s)',
                    },
                  ]}
               >
               <Input/>
               </Form.Item>
               <Form.Item
               label="Card Number"
               name="card number"
               rules={[
                    {
                      required: true,
                      message: 'Please enter your card number',
                    },
                  ]}     
               >
               <Input/>
               </Form.Item>
               <Form.Item
               label="Postal Code"
               name="postal code"
               rules={[
                    {
                         required: true,
                         message: 'Please enter your postal code',
                    },
                    ]}  
               >
               <Input/>
               </Form.Item>
          
          </Col>
          <Col span={12}>
               <Form.Item
               label="Last Name"
               name="last name"
               rules={[
                    {
                      required: true,
                      message: 'Please enter your last name',
                    },
                  ]}
               >
               <Input/>
               </Form.Item>
               <Form.Item>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                   label="Expiration"
                                   name="expiration"
                                   rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the expiration date',
                                        },
                                    ]}
                                >
                                   <Input placeholder="MM/YY" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                   label= "CVV"
                                    name="cvv"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter CVV number',
                                        },
                                    ]}
                                   >
                                    <Input placeholder="CVV" />
                                </Form.Item>
                            </Col>
                        </Row>
               </Form.Item>

               <Form.Item 
               label="Email"
               name="email"
               rules={[
                    {
                         required: true,
                         message: 'Please enter your email',
                    },
                    ]}  
               >
               <Input/>
               </Form.Item>
          
          </Col>
          
          
        </Row>
     </Form>
        
   </Modal>)
}