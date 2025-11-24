package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.aspectj.bridge.IMessage;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "carBranch")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Check(constraints = "port_type IN ('AC', 'CCS', 'CHAdeMO')")
public class CarBranch {
        @Id
        @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
        private int id;

        @Column(nullable = false, length = 20)
        @NotNull(message = "Không được để trống tên hãng xe")
        private String brand;

        @NotNull(message = "Không được để trống dung lượng pin")
        private double batteryCapacity;//kwh

    @Column(name="port_type")
    @NotEmpty(message = "Không được để trống loại cổng sạc")
    private String portType;

    @Column(nullable = false)
    private boolean active = true;

}
