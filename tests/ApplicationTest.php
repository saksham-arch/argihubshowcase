<?php

use PHPUnit\Framework\TestCase;

final class ApplicationTest extends TestCase
{
    public function testStaticProductCatalogContainsSeedData(): void
    {
        $products = staticProductCatalog();

        $this->assertCount(6, $products);
        $this->assertSame('Premium Paddy Seeds (1 kg)', $products[0]['name']);
        $this->assertSame('in_stock', $products[0]['stock_status']);
    }

    public function testValidateRegistrationDataAcceptsValidPayload(): void
    {
        $result = validateRegistrationData([
            'fullname' => 'Farmer One',
            'email' => 'farmer@example.com',
            'phone' => '+91 9999999999',
            'password' => 'strongpass',
            'address' => 'Village, District, State',
            'land' => '4.5',
            'service' => 'Soil Testing',
            'preferred_language' => 'English',
        ]);

        $this->assertTrue($result['valid']);
        $this->assertSame([], $result['errors']);
        $this->assertSame('farmer@example.com', $result['data']['email']);
    }

    public function testValidateRegistrationDataRejectsInvalidPayload(): void
    {
        $result = validateRegistrationData([
            'fullname' => 'A',
            'email' => 'invalid',
            'phone' => '123',
            'password' => 'short',
            'address' => '',
            'land' => '-1',
            'service' => '',
            'preferred_language' => '',
        ]);

        $this->assertFalse($result['valid']);
        $this->assertArrayHasKey('fullname', $result['errors']);
        $this->assertArrayHasKey('email', $result['errors']);
        $this->assertArrayHasKey('password', $result['errors']);
        $this->assertArrayHasKey('land_area', $result['errors']);
    }

    public function testNormalizeOrderItemsGroupsDuplicateProducts(): void
    {
        $items = normalizeOrderItems([
            ['name' => 'NPK Fertilizer 5 kg Bag', 'price' => 595],
            ['name' => 'NPK Fertilizer 5 kg Bag', 'price' => 595],
            ['name' => 'Premium Paddy Seeds (1 kg)', 'price' => 249],
        ]);

        $this->assertCount(2, $items);
        $this->assertSame(2, $items[0]['quantity']);
        $this->assertSame(1190.0, $items[0]['subtotal']);
    }

    public function testValidateOrderPayloadRejectsTamperedTotal(): void
    {
        $payload = validateOrderPayload([
            'customer_name' => 'Raghav Patil',
            'phone' => '+91 9876543210',
            'address' => 'Nashik, Maharashtra',
            'payment_mode' => 'UPI / QR',
            'items' => json_encode([
                ['name' => 'Premium Paddy Seeds (1 kg)', 'price' => 249],
                ['name' => 'NPK Fertilizer 5 kg Bag', 'price' => 595],
            ]),
            'total' => 1,
        ]);

        $this->assertFalse($payload['valid']);
        $this->assertArrayHasKey('total', $payload['errors']);
    }

    public function testValidateOrderPayloadAcceptsValidCart(): void
    {
        $payload = validateOrderPayload([
            'customer_name' => 'Raghav Patil',
            'phone' => '+91 9876543210',
            'address' => 'Nashik, Maharashtra',
            'payment_mode' => 'Cash on Delivery',
            'items' => json_encode([
                ['name' => 'Premium Paddy Seeds (1 kg)', 'price' => 249],
                ['name' => 'NPK Fertilizer 5 kg Bag', 'price' => 595],
            ]),
            'total' => 844,
        ]);

        $this->assertTrue($payload['valid']);
        $this->assertSame(844.0, $payload['data']['total']);
        $this->assertCount(2, $payload['data']['items']);
    }

    public function testMapPaymentGatewaySupportsConfiguredModes(): void
    {
        $this->assertSame('COD', mapPaymentGateway('Cash on Delivery'));
        $this->assertSame('UPI', mapPaymentGateway('UPI / QR'));
        $this->assertSame('BANK_TRANSFER', mapPaymentGateway('Bank Transfer'));
    }
}
